import { AdminAccess } from '@/components/admin-access';
import { AdminLogs } from '@/pages/admin/logs';
import { AdminPersonalization } from '@/pages/admin/personalization';
import { AdminInstructors } from '@/pages/admin/instructors';
import { useEffect, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider, RedirectToSignIn, Show, SignIn, SignUp, useAuth, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ActivitiesPage,
  CourseDetailPage,
  CourseWorkspacePage,
  CoursesPage,
  DashboardPage,
  LandingPage,
  LessonPage,
} from '@/pages/academy-pages';
import { AdminDashboard } from '@/pages/admin/dashboard';
import { AdminCourses } from '@/pages/admin/courses';
import { AdminCourseBuilder } from '@/pages/admin/course-builder';
import { AdminMediaLibrary } from '@/pages/admin/media';
import { AdminStudents } from '@/pages/admin/students';
import { AdminQuizzes } from '@/pages/admin/quizzes';
import { AdminAnalytics } from '@/pages/admin/analytics';
import { AdminSettings } from '@/pages/admin/settings';
import {
  Route,
  Redirect,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (was cacheTime)
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
});
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#ff6a00',
    colorForeground: '#f5f5f5',
    colorMutedForeground: '#a3a3a3',
    colorDanger: '#fb7185',
    colorBackground: '#111111',
    colorInput: '#1b1b1b',
    colorInputForeground: '#f5f5f5',
    colorNeutral: '#383838',
    fontFamily: 'DM Sans, sans-serif',
    borderRadius: '0.7rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[#111111] rounded-2xl w-[440px] max-w-full overflow-hidden border border-[#303030]',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[#f5f5f5]',
    headerSubtitle: 'text-[#a3a3a3]',
    socialButtonsBlockButtonText: 'text-[#f5f5f5]',
    formFieldLabel: 'text-[#e5e5e5]',
    footerActionLink: 'text-[#ff6a00]',
    footerActionText: 'text-[#a3a3a3]',
    dividerText: 'text-[#a3a3a3]',
    identityPreviewEditButton: 'text-[#ff6a00]',
    formFieldSuccessText: 'text-emerald-300',
    alertText: 'text-rose-300',
    logoBox: 'mb-3',
    logoImage: 'max-h-8',
    socialButtonsBlockButton: 'border-[#383838] bg-[#1b1b1b] hover:bg-[#242424]',
    formButtonPrimary: 'bg-[#ff6a00] text-black hover:bg-[#ff8126]',
    formFieldInput: 'border-[#383838] bg-[#1b1b1b] text-[#f5f5f5]',
    footerAction: 'bg-transparent',
    dividerLine: 'bg-[#383838]',
    alert: 'border-[#713f46] bg-[#311b20]',
    otpCodeFieldInput: 'border-[#383838] bg-[#1b1b1b] text-[#f5f5f5]',
    formFieldRow: 'mb-4',
    main: 'bg-transparent',
  },
};

function Protected({ children }: { children: ReactNode }) {
  return (
    <>
      <Show when="signed-in">{children}</Show>
      <Show when="signed-out"><RedirectToSignIn /></Show>
    </>
  );
}

function HomeRedirect() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <LandingPage />;
  return isSignedIn ? <Redirect to="/dashboard" /> : <LandingPage />;
}

function SignInPage() {
  return <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4"><SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} /></div>;
}

function SignUpPage() {
  return <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4"><SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} /></div>;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  useEffect(() => {
    const unsubscribe = addListener(() => {
      queryClient.clear();
    });
    return unsubscribe;
  }, [addListener]);
  return null;
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={HomeRedirect} />
        <Route path="/dashboard"><Protected><DashboardPage /></Protected></Route>
        <Route path="/cursos"><CoursesPage /></Route>
        <Route path="/cursos/:slug" component={CourseDetailPage} />
        <Route path="/curso/:courseId/aula/:lessonId"><Protected><LessonPage /></Protected></Route>
        <Route path="/curso/:courseId"><Protected><CourseWorkspacePage /></Protected></Route>
        <Route path="/atividades"><Protected><ActivitiesPage /></Protected></Route>
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        
        {/* Admin Routes */}
        <Route path="/admin"><Protected><AdminAccess><AdminDashboard /></AdminAccess></Protected></Route>
        <Route path="/admin/cursos"><Protected><AdminAccess><AdminCourses /></AdminAccess></Protected></Route>
        <Route path="/admin/construtor"><Protected><AdminAccess><AdminCourseBuilder /></AdminAccess></Protected></Route>
        <Route path="/admin/midia"><Protected><AdminAccess><AdminMediaLibrary /></AdminAccess></Protected></Route>
        <Route path="/admin/alunos"><Protected><AdminAccess><AdminStudents /></AdminAccess></Protected></Route>
        <Route path="/admin/quizzes"><Protected><AdminAccess><AdminQuizzes /></AdminAccess></Protected></Route>
        <Route path="/admin/analytics"><Protected><AdminAccess><AdminAnalytics /></AdminAccess></Protected></Route>
        <Route path="/admin/configuracoes"><Protected><AdminAccess><AdminSettings /></AdminAccess></Protected></Route>
        
        <Route path="/admin/logs"><Protected><AdminAccess><AdminLogs /></AdminAccess></Protected></Route>
        <Route path="/admin/personalizacao"><Protected><AdminAccess><AdminPersonalization /></AdminAccess></Protected></Route>
        <Route path="/admin/instrutores"><Protected><AdminAccess><AdminInstructors /></AdminAccess></Protected></Route>
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProvider
        publishableKey={clerkPubKey}
        proxyUrl={clerkProxyUrl}
        appearance={clerkAppearance}
        signInUrl={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        localization={{
          signIn: { start: { title: 'Boas-vindas de volta', subtitle: 'Entre para continuar sua jornada' } },
          signUp: { start: { title: 'Crie sua conta', subtitle: 'Comece sua jornada na Nativos Academy' } },
        }}
      >
        <QueryClientProvider client={queryClient}>
          <ClerkQueryClientCacheInvalidator />
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </ClerkProvider>
    </WouterRouter>
  );
}

export default App;
