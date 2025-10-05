import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const API_URL = 'https://functions.poehali.dev/dc4f2a00-b620-4381-a989-025349e50549';

interface PhotoStyle {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
}

interface GeneratedImage {
  url: string;
  style: string;
  timestamp: number;
  id: string;
}

const photoStyles: PhotoStyle[] = [
  {
    id: 'professional',
    name: 'Профессиональный',
    description: 'Студийная съёмка',
    icon: 'User',
    gradient: 'from-purple-600 via-purple-500 to-pink-500'
  },
  {
    id: 'fashion',
    name: 'Мода',
    description: 'Журнальный стиль',
    icon: 'Sparkles',
    gradient: 'from-pink-600 via-pink-500 to-rose-500'
  },
  {
    id: 'cinematic',
    name: 'Кино',
    description: 'Драматичное освещение',
    icon: 'Film',
    gradient: 'from-purple-700 via-indigo-600 to-blue-600'
  },
  {
    id: 'nature',
    name: 'Природа',
    description: 'Естественный свет',
    icon: 'TreePine',
    gradient: 'from-emerald-600 via-teal-500 to-cyan-500'
  },
  {
    id: 'glamour',
    name: 'Гламур',
    description: 'Роскошный стиль',
    icon: 'Gem',
    gradient: 'from-violet-600 via-purple-600 to-fuchsia-600'
  },
  {
    id: 'artistic',
    name: 'Художественный',
    description: 'Креативная композиция',
    icon: 'Palette',
    gradient: 'from-indigo-600 via-blue-600 to-cyan-600'
  }
];

const Index = () => {
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
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
      toast.error('Сначала загрузите фото!');
      return;
    }

    setIsGenerating(true);
    toast.success(`Создаю ${style.name.toLowerCase()}...`);
    
    setTimeout(() => {
      const mockImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop';
      const newImage: GeneratedImage = {
        url: mockImage,
        style: style.name,
        timestamp: Date.now(),
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      setGeneratedImages(prev => [newImage, ...prev]);
      setGenerationCount(prev => prev + 1);
      setIsGenerating(false);
      toast.success('Готово! ✨');
    }, 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none" />
      
      <div className="container max-w-4xl mx-auto px-4 py-8 relative z-10">
        <header className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-50 animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl">
                <Icon name="Sparkles" size={36} className="text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Нейрофотосессия
          </h1>
          <p className="text-lg text-gray-300">
            Преобразите себя в любом стиле
          </p>
          {generationCount > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/30 backdrop-blur-sm border border-purple-500/30">
              <Icon name="Zap" size={16} className="text-purple-400" />
              <span className="text-sm text-purple-300">Генераций: <strong>{generationCount}</strong></span>
            </div>
          )}
        </header>

        <div className="mb-8 animate-scale-in">
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-xl shadow-2xl">
            <div className="p-8">
              <div className="flex flex-col items-center gap-6">
                {!uploadedPhoto ? (
                  <>
                    <div className="relative w-48 h-48 rounded-3xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center border-2 border-dashed border-purple-500/30 backdrop-blur-sm group hover:border-purple-500/60 transition-all">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Icon name="ImagePlus" size={64} className="text-purple-400/50 group-hover:text-purple-400 transition-colors relative z-10" />
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
                      className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50 border-0"
                    >
                      <Icon name="Upload" size={20} />
                      Загрузить фото
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="relative w-48 h-48 rounded-3xl overflow-hidden group shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/30 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                      <img 
                        src={uploadedPhoto} 
                        alt="Uploaded" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <Button
                          variant="secondary"
                          className="bg-white/90 hover:bg-white backdrop-blur-sm"
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
            </div>
          </Card>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-200 flex items-center gap-2">
            <Icon name="Palette" size={24} className="text-purple-400" />
            Выберите стиль
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photoStyles.map((style, index) => (
              <Card
                key={style.id}
                className="group cursor-pointer overflow-hidden border-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 animate-scale-in"
                style={{ animationDelay: `${index * 80}ms` }}
                onClick={() => handleGenerate(style)}
              >
                <div className="p-6 flex flex-col items-center gap-3 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${style.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative z-10`}>
                    <Icon name={style.icon as any} size={28} className="text-white drop-shadow-lg" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-base font-semibold text-white mb-1">
                      {style.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {style.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-50 animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl">
                <Icon name="Sparkles" size={36} className="text-white animate-spin" />
              </div>
            </div>
            <p className="text-xl font-medium mt-6 text-gray-200">Создаю магию...</p>
          </div>
        )}

        {generatedImages.length > 0 && (
          <section className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200 flex items-center gap-2">
              <Icon name="Images" size={24} className="text-purple-400" />
              Ваши фото ({generatedImages.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedImages.map((image, index) => (
                <Card 
                  key={image.id} 
                  className="group overflow-hidden border-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/30 transition-all animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-square">
                    <img 
                      src={image.url} 
                      alt={`Generated ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <Button
                      size="sm"
                      variant={isFavorite(image.id) ? "default" : "secondary"}
                      className={`absolute top-3 right-3 z-10 ${isFavorite(image.id) ? 'bg-purple-600 hover:bg-purple-700' : 'bg-white/90 hover:bg-white'}`}
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

                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="w-full bg-white/90 hover:bg-white backdrop-blur-sm"
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
                  <div className="p-4 bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-sm">
                    <p className="text-sm font-medium text-center text-gray-200">
                      {image.style}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {favorites.length > 0 && (
          <section className="mt-12 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200 flex items-center gap-2">
              <Icon name="Star" size={24} className="text-yellow-400 fill-current" />
              Избранное ({favorites.length})
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {favorites.slice(0, 6).map((image, index) => (
                <Card 
                  key={image.id} 
                  className="group overflow-hidden border-0 bg-gradient-to-br from-yellow-900/20 to-purple-900/20 backdrop-blur-sm hover:shadow-xl hover:shadow-yellow-500/20 transition-all"
                >
                  <div className="relative aspect-square">
                    <img 
                      src={image.url} 
                      alt={`Favorite ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Icon name="Star" size={14} className="text-yellow-400 fill-current drop-shadow-lg" />
                    </div>
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
