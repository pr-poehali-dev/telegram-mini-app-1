import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface PhotoStyle {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: string;
  gradient: string;
}

const photoStyles: PhotoStyle[] = [
  {
    id: 'portrait',
    name: 'Портрет',
    description: 'Профессиональная студийная съёмка',
    prompt: 'professional studio portrait, soft lighting, elegant pose, high quality, detailed face',
    icon: 'User',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'fashion',
    name: 'Мода',
    description: 'Стильная модная фотосессия',
    prompt: 'fashion photography, editorial style, trendy outfit, professional model pose, magazine quality',
    icon: 'Sparkles',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    id: 'nature',
    name: 'Природа',
    description: 'На фоне живописной природы',
    prompt: 'outdoor photography, beautiful nature background, natural lighting, scenic landscape',
    icon: 'TreePine',
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'business',
    name: 'Бизнес',
    description: 'Деловой корпоративный стиль',
    prompt: 'business professional portrait, office background, confident pose, formal attire, corporate photography',
    icon: 'Briefcase',
    gradient: 'from-blue-500 to-cyan-500'
  }
];

const Index = () => {
  const [selectedStyle, setSelectedStyle] = useState<PhotoStyle | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (style: PhotoStyle) => {
    setIsGenerating(true);
    setSelectedStyle(style);
    
    toast.success(`Генерирую фото в стиле "${style.name}"...`);
    
    setTimeout(() => {
      const mockImage = 'https://v3b.fal.media/files/b/tiger/XhG2PAMU0h1HONPDnGpjQ_output.png';
      setGeneratedImages(prev => [mockImage, ...prev]);
      setIsGenerating(false);
      toast.success('Фото готово!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        <header className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-4 animate-pulse-glow">
            <Icon name="Camera" size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            AI Фотосессия
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Создавайте профессиональные фотографии одним кликом
          </p>
        </header>

        <section className="space-y-4 animate-fade-in">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Icon name="Palette" size={24} />
            Выберите стиль
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {photoStyles.map((style, index) => (
              <Card
                key={style.id}
                className="p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-primary animate-scale-in group"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleGenerate(style)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${style.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon name={style.icon as any} size={32} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                      {style.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {style.description}
                    </p>
                  </div>
                  <Icon 
                    name="ChevronRight" 
                    size={24} 
                    className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" 
                  />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse-glow flex items-center justify-center">
              <Icon name="Sparkles" size={32} className="text-white animate-spin" />
            </div>
            <p className="text-lg font-medium">Создаю магию...</p>
          </div>
        )}

        {generatedImages.length > 0 && (
          <section className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Icon name="Images" size={24} />
              Галерея ({generatedImages.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedImages.map((image, index) => (
                <Card 
                  key={index} 
                  className="overflow-hidden group cursor-pointer animate-scale-in hover:shadow-2xl transition-all"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-square">
                    <img 
                      src={image} 
                      alt={`Generated ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = image;
                          link.download = `ai-photo-${index + 1}.png`;
                          link.click();
                          toast.success('Фото скачано!');
                        }}
                      >
                        <Icon name="Download" size={16} className="mr-2" />
                        Скачать
                      </Button>
                    </div>
                  </div>
                  {selectedStyle && index === 0 && (
                    <div className="p-3 bg-muted">
                      <p className="text-sm font-medium text-center">
                        {selectedStyle.name}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Index;
