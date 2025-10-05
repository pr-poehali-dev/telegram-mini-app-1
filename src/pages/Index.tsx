import { useState, useRef } from 'react';
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
    id: 'professional',
    name: 'Профессиональный портрет',
    description: 'Студийная съёмка высшего класса',
    prompt: 'professional studio portrait, soft lighting, elegant pose, high quality, detailed face',
    icon: 'User',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'fashion',
    name: 'Модная съёмка',
    description: 'Стильная журнальная фотография',
    prompt: 'fashion photography, editorial style, trendy outfit, professional model pose, magazine quality',
    icon: 'Sparkles',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    id: 'cinematic',
    name: 'Кинематограф',
    description: 'Драматичное киношное освещение',
    prompt: 'cinematic portrait, dramatic lighting, movie scene, film grain, professional cinematography',
    icon: 'Film',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    id: 'nature',
    name: 'На природе',
    description: 'Живописный природный фон',
    prompt: 'outdoor photography, beautiful nature background, natural lighting, scenic landscape',
    icon: 'TreePine',
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'business',
    name: 'Деловой стиль',
    description: 'Корпоративная фотография',
    prompt: 'business professional portrait, office background, confident pose, formal attire, corporate photography',
    icon: 'Briefcase',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'glamour',
    name: 'Гламур',
    description: 'Роскошная глянцевая съёмка',
    prompt: 'glamour photography, luxury style, elegant makeup, professional retouching, high fashion',
    icon: 'Gem',
    gradient: 'from-violet-500 to-purple-500'
  },
  {
    id: 'vintage',
    name: 'Винтаж',
    description: 'Ретро стиль 60-х годов',
    prompt: 'vintage photography, retro style, film grain, nostalgic atmosphere, classic portrait',
    icon: 'Camera',
    gradient: 'from-amber-600 to-yellow-600'
  },
  {
    id: 'artistic',
    name: 'Художественный',
    description: 'Креативная арт-фотография',
    prompt: 'artistic portrait, creative composition, unique perspective, fine art photography',
    icon: 'Palette',
    gradient: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'urban',
    name: 'Городской',
    description: 'Уличная урбан-съёмка',
    prompt: 'urban street photography, city background, modern architecture, street style',
    icon: 'Building2',
    gradient: 'from-slate-500 to-gray-500'
  },
  {
    id: 'romantic',
    name: 'Романтический',
    description: 'Нежная мечтательная атмосфера',
    prompt: 'romantic portrait, soft focus, dreamy atmosphere, pastel colors, gentle lighting',
    icon: 'Heart',
    gradient: 'from-rose-400 to-pink-400'
  },
  {
    id: 'fantasy',
    name: 'Фэнтези',
    description: 'Волшебная сказочная съёмка',
    prompt: 'fantasy portrait, magical atmosphere, ethereal lighting, fairy tale style, enchanted',
    icon: 'Wand2',
    gradient: 'from-purple-600 to-blue-600'
  },
  {
    id: 'minimalist',
    name: 'Минимализм',
    description: 'Чистый простой стиль',
    prompt: 'minimalist portrait, clean background, simple composition, modern aesthetic',
    icon: 'Square',
    gradient: 'from-gray-400 to-slate-400'
  }
];

interface GeneratedImage {
  url: string;
  style: string;
  timestamp: number;
}

const Index = () => {
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<PhotoStyle | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedPhoto(event.target?.result as string);
        toast.success('Фото загружено!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (style: PhotoStyle) => {
    if (!uploadedPhoto) {
      toast.error('Сначала загрузите ваше фото!');
      return;
    }

    setIsGenerating(true);
    setSelectedStyle(style);
    
    toast.success(`Создаю ${style.name.toLowerCase()}...`);
    
    setTimeout(() => {
      const mockImage = 'https://v3b.fal.media/files/b/tiger/XhG2PAMU0h1HONPDnGpjQ_output.png';
      setGeneratedImages(prev => [{
        url: mockImage,
        style: style.name,
        timestamp: Date.now()
      }, ...prev]);
      setGenerationCount(prev => prev + 1);
      setIsGenerating(false);
      toast.success('Готово! ✨');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        <header className="text-center space-y-3 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-2 animate-pulse-glow">
            <Icon name="Sparkles" size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Нейрофотосессия
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Загрузите фото и преобразите его в любом стиле
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Icon name="Zap" size={16} className="text-primary" />
            <span>Генераций: <strong className="text-primary">{generationCount}</strong></span>
          </div>
        </header>

        <Card className="p-6 animate-fade-in">
          <div className="flex flex-col items-center gap-4">
            {!uploadedPhoto ? (
              <>
                <div className="w-40 h-40 rounded-2xl bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                  <Icon name="ImagePlus" size={48} className="text-muted-foreground/50" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  size="lg"
                  className="gap-2"
                >
                  <Icon name="Upload" size={20} />
                  Загрузить фото
                </Button>
              </>
            ) : (
              <>
                <div className="relative w-40 h-40 rounded-2xl overflow-hidden group">
                  <img 
                    src={uploadedPhoto} 
                    alt="Uploaded" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Icon name="RefreshCw" size={16} className="mr-2" />
                      Заменить
                    </Button>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </>
            )}
          </div>
        </Card>

        <section className="space-y-4 animate-fade-in">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Icon name="Palette" size={24} />
            Выберите стиль
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {photoStyles.map((style, index) => (
              <Card
                key={style.id}
                className="p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-primary animate-scale-in group"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleGenerate(style)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon name={style.icon as any} size={24} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold mb-0.5 group-hover:text-primary transition-colors truncate">
                      {style.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {style.description}
                    </p>
                  </div>
                  <Icon 
                    name="ChevronRight" 
                    size={20} 
                    className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" 
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
              Ваши фото ({generatedImages.length})
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
                      src={image.url} 
                      alt={`Generated ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = image.url;
                          link.download = `neurogen-${image.style}-${index + 1}.png`;
                          link.click();
                          toast.success('Фото скачано! ✅');
                        }}
                      >
                        <Icon name="Download" size={16} className="mr-2" />
                        Скачать
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 bg-muted">
                    <p className="text-sm font-medium text-center">
                      {image.style}
                    </p>
                  </div>
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
