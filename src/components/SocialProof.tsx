import { Card, CardContent } from "@/components/ui/card";

const SocialProof = () => {
  const testimonials = [
    {
      quote: "BLEE transformed our strategic planning process. What used to take months now happens in days, with crystal clear outcomes.",
      author: "Sarah Chen",
      title: "Chief Strategy Officer",
      company: "TechGlobal Inc."
    },
    {
      quote: "The clarity we gained in 48 hours was remarkable. Our teams finally had the direction they needed to execute at scale.",
      author: "Michael Rodriguez",
      title: "VP of Operations", 
      company: "GrowthScale"
    },
    {
      quote: "BLEE doesn't just consult—they embed and activate. The ownership our team took after their intervention was game-changing.",
      author: "Jennifer Park",
      title: "CEO",
      company: "InnovateNow"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Trusted by Leadership Teams</h2>
          <p className="text-xl text-muted-foreground">
            See what executives say about working with BLEE
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-lg">
              <CardContent className="p-8">
                <blockquote className="text-lg mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t pt-6">
                  <cite className="not-italic">
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                    <div className="text-sm text-primary font-medium">{testimonial.company}</div>
                  </cite>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;