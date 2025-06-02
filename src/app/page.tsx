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
            <h1 className="text-2xl font-headline">Lex Connect</h1>
          </div>
          <nav>
            <Link href="/dashboard">
              <Button variant="secondary">Access Portal</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6 text-primary">
              Revolutionizing Legal Client Communication
            </h2>
            <p className="text-lg md:text-xl text-foreground mb-8 max-w-3xl mx-auto">
              LEX-Link connects law firms with their clients in real-time. Manage appointments, track case progress, and communicate securely, all in one place.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="font-body">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto">
            <h3 className="text-3xl font-headline font-semibold text-center mb-12 text-primary">
              Key Features
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Secure Messaging", description: "Communicate confidently with end-to-end encrypted messaging.", image: "https://placehold.co/600x400.png", hint: "communication security" },
                { title: "Self-Service Portal", description: "Clients access case updates and documents 24/7, reducing calls.", image: "https://placehold.co/600x400.png", hint: "dashboard report" },
                { title: "Appointment Scheduling", description: "Easily book in-person, video, or written consultations.", image: "https://placehold.co/600x400.png", hint: "calendar schedule" },
                { title: "Push Notifications", description: "Stay informed with automatic updates on case progress.", image: "https://placehold.co/600x400.png", hint: "mobile notification" },
                { title: "E-Signature", description: "Sign documents digitally, speeding up processes securely.", image: "https://placehold.co/600x400.png", hint: "digital signature" },
                { title: "Transparent Case Tracking", description: "Follow your case through every phase: Administrative, Judicial, Recourse, and Closure.", image: "https://placehold.co/600x400.png", hint: "progress chart" },
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
        <p className="font-body">&copy; {new Date().getFullYear()} Lex Connect. All rights reserved.</p>
      </footer>
    </div>
  );
}
