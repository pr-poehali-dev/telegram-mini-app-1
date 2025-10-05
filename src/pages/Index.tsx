import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const API_URL = 'https://functions.poehali.dev/dc4f2a00-b620-4381-a989-025349e50549';

interface PhotoStyle {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: string;
  gradient: string;
  model?: 'flux' | 'sd';
}

interface TemplateExample {
  id: string;
  title: string;
  imageUrl: string;
  style: string;
  prompt: string;
}

const photoStyles: PhotoStyle[] = [
  {
    id: 'professional',
    name: 'Профессиональный портрет',
    description: 'Студийная съёмка высшего класса',
    prompt: 'professional studio portrait, soft lighting, elegant pose, high quality, detailed face',
    icon: 'User',
    gradient: 'from-purple-500 to-pink-500',
    model: 'flux'
  },
  {
    id: 'fashion',
    name: 'Модная съёмка',
    description: 'Стильная журнальная фотография',
    prompt: 'fashion photography, editorial style, trendy outfit, professional model pose, magazine quality',
    icon: 'Sparkles',
    gradient: 'from-pink-500 to-rose-500',
    model: 'flux'
  },
  {
    id: 'cinematic',
    name: 'Кинематограф',
    description: 'Драматичное киношное освещение',
    prompt: 'cinematic portrait, dramatic lighting, movie scene, film grain, professional cinematography',
    icon: 'Film',
    gradient: 'from-amber-500 to-orange-500',
    model: 'sd'
  },
  {
    id: 'nature',
    name: 'На природе',
    description: 'Живописный природный фон',
    prompt: 'outdoor photography, beautiful nature background, natural lighting, scenic landscape',
    icon: 'TreePine',
    gradient: 'from-emerald-500 to-teal-500',
    model: 'sd'
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
  id: string;
}

const Index = () => {
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<PhotoStyle | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [favorites, setFavorites] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('neurogen-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (image: GeneratedImage) => {
    const isFavorite = favorites.some(fav => fav.id === image.id);
    let newFavorites: GeneratedImage[];
    
    if (isFavorite) {
      newFavorites = favorites.filter(fav => fav.id !== image.id);
      toast.success('Удалено из избранного');
    } else {
      newFavorites = [...favorites, image];
      toast.success('Добавлено в избранное ⭐');
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('neurogen-favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (imageId: string) => {
    return favorites.some(fav => fav.id === imageId);
  };

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
    
    try {
      const imageBase64 = uploadedPhoto.split(',')[1];
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: style.model || 'flux',
          prompt: style.prompt,
          image: imageBase64,
          style: style.description
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.image_url) {
        const newImage: GeneratedImage = {
          url: data.image_url,
          style: style.name,
          timestamp: Date.now(),
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        setGeneratedImages(prev => [newImage, ...prev]);
        setGenerationCount(prev => prev + 1);
        toast.success('Готово! ✨');
      } else {
        toast.error(data.error || 'Ошибка генерации');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Не удалось создать фото');
    } finally {
      setIsGenerating(false);
    }
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

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="generate">Генерация</TabsTrigger>
            <TabsTrigger value="favorites" className="relative">
              Избранное
              {favorites.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                  {favorites.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="examples">Примеры</TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
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
                      <Button
                        size="sm"
                        variant={isFavorite(image.id) ? "default" : "secondary"}
                        className="absolute top-3 right-3 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(image);
                        }}
                      >
                        <Icon 
                          name={isFavorite(image.id) ? "Star" : "StarOff"} 
                          size={16} 
                          className={isFavorite(image.id) ? "fill-current" : ""}
                        />
                      </Button>
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
        </TabsContent>

        <TabsContent value="favorites">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Icon name="Star" size={24} className="fill-current text-primary" />
              Избранные фото ({favorites.length})
            </h2>
            
            {favorites.length === 0 ? (
              <Card className="p-12 text-center">
                <Icon name="StarOff" size={64} className="mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">Пока пусто</h3>
                <p className="text-muted-foreground">
                  Добавляйте понравившиеся фото в избранное, нажимая на звёздочку
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((image, index) => (
                  <Card 
                    key={image.id} 
                    className="overflow-hidden group cursor-pointer animate-scale-in hover:shadow-2xl transition-all"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative aspect-square">
                      <img 
                        src={image.url} 
                        alt={`Favorite ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <Button
                        size="sm"
                        variant="default"
                        className="absolute top-3 right-3 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(image);
                        }}
                      >
                        <Icon name="Star" size={16} className="fill-current" />
                      </Button>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = image.url;
                            link.download = `favorite-${image.style}-${index + 1}.png`;
                            link.click();
                            toast.success('Фото скачано! ✅');
                          }}
                        >
                          <Icon name="Download" size={16} className="mr-2" />
                          Скачать
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(image);
                          }}
                        >
                          <Icon name="Trash2" size={16} />
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
            )}
          </section>
        </TabsContent>

        <TabsContent value="examples">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Icon name="Lightbulb" size={24} />
              Готовые шаблоны и примеры
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: 'Профессиональный портрет',
                  imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
                  style: 'Студийное освещение',
                  prompt: 'professional studio portrait, soft lighting, elegant pose'
                },
                {
                  title: 'Модная съёмка',
                  imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop',
                  style: 'Журнальный стиль',
                  prompt: 'fashion photography, editorial style, trendy outfit'
                },
                {
                  title: 'Кинематограф',
                  imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
                  style: 'Драматичное освещение',
                  prompt: 'cinematic portrait, dramatic lighting, movie scene'
                },
                {
                  title: 'На природе',
                  imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
                  style: 'Естественный свет',
                  prompt: 'outdoor photography, natural lighting, scenic landscape'
                },
                {
                  title: 'Гламур',
                  imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
                  style: 'Роскошный стиль',
                  prompt: 'glamour photography, luxury style, elegant makeup'
                },
                {
                  title: 'Художественный',
                  imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
                  style: 'Креативная композиция',
                  prompt: 'artistic portrait, creative composition, fine art'
                }
              ].map((example, index) => (
                <Card 
                  key={index}
                  className="overflow-hidden group animate-scale-in hover:shadow-xl transition-all cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-square">
                    <img 
                      src={example.imageUrl} 
                      alt={example.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <p className="text-white text-xs mb-2 opacity-80">{example.prompt}</p>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => {
                          toast.info('Загрузите своё фото и выберите этот стиль!');
                        }}
                      >
                        <Icon name="Wand2" size={16} className="mr-2" />
                        Применить стиль
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="font-semibold">{example.title}</h3>
                    <p className="text-sm text-muted-foreground">{example.style}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default Index;