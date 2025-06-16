
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Scale } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import QuoteCarousel from "@/components/landing/QuoteCarousel"; // Importar el nuevo componente

export default function LandingPage() {
  const features = [
    { title: "Intercambio Seguro de Mensajes abogado-cliente", description: "Comunícate con confianza con mensajería cifrada de extremo a extremo.", image: "/images/mensajeria-segura.png", hint: "communication security" },
    { title: "Portal de Autoservicio 365 abierto y disponible 24x7", description: "Clientes acceden a actualizaciones de casos y documentos 24/7, reduciendo llamadas.", image: "/images/portal-autoservicio.png", hint: "computer monitor" },
    { title: "Programación automática de las Citas (diversos tipos)", description: "Reserva fácilmente consultas presenciales, por video o escritas.", image: "/images/programacion-citas.png", hint: "calendar schedule" },
    { title: "Notificaciones Push dadas en el instante preciso", description: "Mantente informado con actualizaciones automáticas sobre el progreso del caso.", image: "/images/notificaciones-push.png", hint: "mobile notification" },
    { title: "Firma Electrónica aplicada en todas las actuaciones", description: "Firma documentos digitalmente, agilizando procesos de forma segura.", image: "/images/firma-electronica.png", hint: "digital signature" },
    { title: "Seguimiento Transparente de los Casos y Expedientes", description: "Sigue tu caso en cada fase: Administrativa, Judicial, Recurso y Cierre.", image: "/images/seguimiento-casos.png", hint: "progress chart" },
  ];

  const demoVersion = "1.5";

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-8 w-8" />
            <h1 className="text-2xl font-headline">LexLINK</h1>
          </div>
          <nav>
            <Link href="/login">
              <Button variant="secondary">Acceder a Panel</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="pt-16 md:pt-24 pb-8 md:pb-12 bg-background">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6 text-primary">
              Revolucionando la Comunicación de los despachos de abogados con sus clientes en sus asuntos legales ("sus casos")
            </h2>
            <p className="text-lg md:text-xl text-foreground mb-8 max-w-3xl mx-auto">
              LexLINK conecta a los despachos de abogados con sus clientes en tiempo real de manera moderna y eficiente. Gestiona las citas, el progreso de sus casos y los expedientes. Comunicandose todo entre ellos de forma segura, todo en un solo lugar.
            </p>
            <Button size="lg" className="font-body" asChild>
              <Link href="https://sedejudicial.justicia.es/-/lexnet" target="_blank" rel="noopener noreferrer">
                Enlace a LexNET <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Carrusel de Frases Publicitarias */}
        <QuoteCarousel />

        <section className="pt-8 md:pt-12 pb-16 md:pb-24">
          <div className="container mx-auto">
            <h3 className="text-3xl font-headline font-semibold text-center mb-12 text-primary">
              Características Clave
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="shadow-lg hover:scale-105 hover:shadow-2xl hover:border-primary transition-all duration-300 ease-in-out">
                  <CardHeader>
                    <Image src={feature.image} alt={feature.title} width={600} height={400} className="rounded-t-lg" data-ai-hint={feature.hint}/>
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
        <p className="font-body text-sm mt-1">DEMO versión: {demoVersion}</p>
      </footer>
    </div>
  );
}


