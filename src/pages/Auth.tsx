import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PremiumCard } from '@/components/PremiumCard';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.string().email('Email invalide');
const passwordSchema = z.string().min(6, 'Minimum 6 caractères');

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { signIn, signUp } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }

    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Email ou mot de passe incorrect');
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success('Connexion réussie !');
        navigate('/');
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('User already registered')) {
            toast.error('Cet email est déjà utilisé');
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success('Compte créé ! Tu as 2 minutes d\'essai gratuit.');
        navigate('/');
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-8 flex flex-col">
      {/* Header */}
      <header className="text-center mb-8 animate-fade-in">
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-silver/20 to-silver/5 mb-4">
          <Clock className="w-12 h-12 text-silver-light" />
        </div>
        <h1 className="text-3xl font-bold silver-text mb-2">
          Je vends mon temps
        </h1>
        <p className="text-muted-foreground">
          {isLogin ? 'Content de te revoir !' : 'Commence ta transformation'}
        </p>
      </header>

      {/* Trial Info */}
      {!isLogin && (
        <PremiumCard className="mb-6 animate-slide-up text-center" frost>
          <div className="flex items-center justify-center gap-2 text-silver-light">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">2 minutes d'essai gratuit</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Teste l'app, puis débloque l'accès à vie
          </p>
        </PremiumCard>
      )}

      {/* Form */}
      <PremiumCard className="flex-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="ton@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 bg-secondary/50 border-border/50 focus:border-silver/50"
              />
            </div>
            {errors.email && (
              <p className="text-destructive text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 pr-11 bg-secondary/50 border-border/50 focus:border-silver/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-destructive text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="premium"
            size="xl"
            className="w-full mt-6"
            disabled={submitting}
          >
            {submitting ? (
              <span className="animate-pulse">Chargement...</span>
            ) : isLogin ? (
              'Se connecter'
            ) : (
              'Créer mon compte'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
            className="text-silver-light hover:text-silver transition-colors"
          >
            {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
          </button>
        </div>
      </PremiumCard>
    </div>
  );
}
