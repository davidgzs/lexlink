
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-8 w-8" />
            <h1 className="text-2xl font-headline">LexLINK</h1>
          </div>
          <nav>
            <Link href="/login">
              <Button variant="secondary">Acceder al Portal</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6 text-primary">
              Revolucionando la Comunicación de los despachos de abogados con sus clientes y sus asuntos legales ("sus casos")
            </h2>
            <p className="text-lg md:text-xl text-foreground mb-8 max-w-3xl mx-auto">
              LexLINK conecta despachos de abogados con sus clientes en tiempo real. Gestiona citas, sigue el progreso de casos y comunícate de forma segura, todo en un solo lugar.
            </p>
            <Link href="/login">
              <Button size="lg" className="font-body">
                Comenzar <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto">
            <h3 className="text-3xl font-headline font-semibold text-center mb-12 text-primary">
              Características Clave
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Mensajería Segura", description: "Comunícate con confianza con mensajería cifrada de extremo a extremo.", image: "https://placehold.co/600x400.png", hint: "communication security" },
                { title: "Portal de Autoservicio", description: "Clientes acceden a actualizaciones de casos y documentos 24/7, reduciendo llamadas.", image: "https://placehold.co/600x400.png", hint: "dashboard report" },
                { title: "Programación de Citas", description: "Reserva fácilmente consultas presenciales, por video o escritas.", image: "https://placehold.co/600x400.png", hint: "calendar schedule" },
                { title: "Notificaciones Push", description: "Mantente informado con actualizaciones automáticas sobre el progreso del caso.", image: "https://placehold.co/600x400.png", hint: "mobile notification" },
                { title: "Firma Electrónica", description: "Firma documentos digitalmente, agilizando procesos de forma segura.", image: "https://placehold.co/600x400.png", hint: "digital signature" },
                { title: "Seguimiento Transparente de Casos", description: "Sigue tu caso en cada fase: Administrativa, Judicial, Recurso y Cierre.", image: "https://placehold.co/600x400.png", hint: "progress chart" },
              ].map((feature) => (
                <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <Image src={feature.image} alt={feature.title} width={600} height={400} className="rounded-t-lg" data-ai-hint={feature.hint} />
                    <CardTitle className="font-headline mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="font-body">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground py-8 text-center">
        <p className="font-body">&copy; {new Date().getFullYear()} LexLINK. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
