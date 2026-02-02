import { Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Upload, Sparkles, Share2, BookOpen, Cpu, GitBranch, BarChart3, Pen } from 'lucide-react';

export function Home() {
  const features = [
    {
      icon: Upload,
      title: 'Upload Image',
      description: 'Drag and drop or select any diagram, chart, or note from your device'
    },
    {
      icon: Sparkles,
      title: 'AI Explains Clearly',
      description: 'Get student-friendly explanations tailored to your level of understanding'
    },
    {
      icon: Share2,
      title: 'Export & Share',
      description: 'Save as PDF, image, or copy text to use in your notes and assignments'
    }
  ];

  const supportedContent = [
    {
      icon: BookOpen,
      title: 'Textbook Diagrams',
      description: 'Complex visuals from physics, biology, chemistry, and more'
    },
    {
      icon: Cpu,
      title: 'Circuit Diagrams',
      description: 'Electronics, computer architecture, and networking diagrams'
    },
    {
      icon: GitBranch,
      title: 'Flowcharts',
      description: 'Algorithm flows, process charts, and decision trees'
    },
    {
      icon: BarChart3,
      title: 'Graphs & Charts',
      description: 'Statistical visualizations, data plots, and infographics'
    },
    {
      icon: Pen,
      title: 'Handwritten Notes',
      description: 'Your own sketches and diagrams that need clarification'
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Understand Any Diagram Instantly
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload textbook images, diagrams, or notes and get clear, student-friendly explanations powered by AI.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/explain">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8">
                Start Explaining
              </Button>
            </Link>
            <Button size="lg" variant="outline" asChild>
              <a href="#how-it-works">How it works</a>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-muted/50 py-16 sm:py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">Three simple steps to understanding</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Content */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Can You Upload?</h2>
            <p className="text-muted-foreground">We support a wide variety of visual content</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportedContent.map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="text-sm">{item.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to understand better?
          </h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            Start explaining your diagrams and images right now. No sign-up required.
          </p>
          <Link to="/explain">
            <Button size="lg" variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100 px-8">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
