import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from 'components/ui/card';
import { LogoWithName } from 'components/BrandLogo';
import { Seo } from 'components/Seo';
import AuthForm from './Forms/AuthForm';

const Auth = () => {
  return (
    <>
    <Seo
      title="Kirish — boshqaruv paneli"
      description="Qizlar Akademiyasi boshqaruv paneliga xavfsiz kirish. Administrator va moderatorlar uchun."
      canonicalPath="/login"
      noindex
    />
    <Card className="w-[350px]">
      <CardHeader className="space-y-4 text-center">
        <div className="flex justify-center">
          <LogoWithName className="h-10 max-h-10 w-auto" />
        </div>
        <CardTitle className="text-base font-medium text-muted-foreground">Boshqaruv paneli</CardTitle>
      </CardHeader>
      <CardContent>
        <AuthForm />
      </CardContent>
    </Card>
    </>
  );
};

export default Auth;