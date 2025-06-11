
"use client";

import { useState, useEffect } from 'react';

interface Quote {
  text: string;
  author?: string;
}

const quotes: Quote[] = [
  {
    text: "¿Tu web de WordPress se queda corta? LexLINK potencia la comunicación real con tus clientes, más allá de un simple formulario de contacto.",
    author: "Despacho Innovador",
  },
  {
    text: "Deja atrás las limitaciones. Con LexLINK, gestiona casos, citas y documentos de forma integrada y segura, algo que WordPress por sí solo no puede ofrecer.",
    author: "Abogado Eficiente",
  },
  {
    text: "LexLINK: Más que una web, una extensión de tu despacho para una interacción cliente-abogado del siglo XXI.",
    author: "Visión de Futuro Legal",
  },
  {
    text: "Transforma la experiencia de tus clientes. Ofrece autoservicio y transparencia con LexLINK, no solo información estática en una página.",
    author: "Cliente Satisfecho",
  },
  {
    text: "La eficiencia y seguridad que tu despacho necesita, y que una web estándar no puede ofrecer. Descubre LexLINK.",
    author: "Socio Director",
  },
];

const QuoteCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible(false); // Comienza la transición de salida
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setIsVisible(true); // Comienza la transición de entrada
      }, 500); // Duración de la transición (0.5s)
    }, 7000); // Cambia cada 7 segundos (6.5s visible + 0.5s transición)

    return () => clearInterval(intervalId);
  }, []);

  const currentQuote = quotes[currentIndex];

  return (
    <section className="py-12 md:py-16 bg-secondary/50 text-center">
      <div className="container mx-auto px-4">
        <div
          className={`max-w-3xl mx-auto transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ minHeight: '150px' }} // Para evitar saltos de layout durante la transición
        >
          <blockquote className="text-2xl md:text-3xl font-headline italic text-primary mb-4">
            <span className="text-5xl md:text-6xl leading-none text-accent/80 relative -top-2 mr-1">&ldquo;</span>
            {currentQuote.text}
            <span className="text-5xl md:text-6xl leading-none text-accent/80 relative -top-2 ml-1">&rdquo;</span>
          </blockquote>
          {currentQuote.author && (
            <cite className="block font-body text-foreground/80 mt-2">&mdash; {currentQuote.author}</cite>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuoteCarousel;
