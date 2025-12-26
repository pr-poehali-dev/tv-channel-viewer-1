import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

interface Channel {
  id: number;
  name: string;
  logo: string;
  currentShow: string;
  nextShow: string;
  category: string;
  isLive: boolean;
}

interface Schedule {
  time: string;
  show: string;
  duration: string;
}

const mockChannels: Channel[] = [
  { id: 1, name: 'Первый', logo: '📺', currentShow: 'Время', nextShow: 'Поле чудес', category: 'Общие', isLive: true },
  { id: 2, name: 'Россия 1', logo: '🎬', currentShow: 'Вечерний эфир', nextShow: 'Кино', category: 'Общие', isLive: true },
  { id: 3, name: 'НТВ', logo: '📰', currentShow: 'Сегодня', nextShow: 'Детектив', category: 'Новости', isLive: true },
  { id: 4, name: 'ТНТ', logo: '🎭', currentShow: 'Комеди Клаб', nextShow: 'Импровизация', category: 'Развлечения', isLive: true },
  { id: 5, name: 'СТС', logo: '🎪', currentShow: 'Уральские пельмени', nextShow: 'Кино', category: 'Развлечения', isLive: true },
  { id: 6, name: 'РЕН ТВ', logo: '🔥', currentShow: 'Самые шокирующие', nextShow: 'Засекреченные списки', category: 'Познавательные', isLive: true },
  { id: 7, name: 'Пятница', logo: '🎉', currentShow: 'Орел и решка', nextShow: 'На ножах', category: 'Развлечения', isLive: true },
  { id: 8, name: 'Матч ТВ', logo: '⚽', currentShow: 'Футбол', nextShow: 'Хоккей', category: 'Спорт', isLive: true },
];

const mockSchedule: Schedule[] = [
  { time: '20:00', show: 'Время', duration: '30 мин' },
  { time: '20:30', show: 'Поле чудес', duration: '60 мин' },
  { time: '21:30', show: 'Вечерние новости', duration: '15 мин' },
  { time: '21:45', show: 'Кино: Брат', duration: '90 мин' },
  { time: '23:15', show: 'Ночной эфир', duration: '45 мин' },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('channels');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(mockChannels[0]);
  const [quality, setQuality] = useState<'HD' | 'SD'>('HD');
  const [favorites, setFavorites] = useState<number[]>([1, 4, 8]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFavorite = (channelId: number) => {
    setFavorites(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const filteredChannels = mockChannels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.currentShow.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteChannels = mockChannels.filter(channel => favorites.includes(channel.id));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Icon name="Tv" size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TV Stream
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Icon name="Bell" size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse-slow" />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="User" size={20} />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="overflow-hidden bg-gradient-to-br from-card to-muted/30 border-border/50">
              <div className="aspect-video bg-black/90 relative group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-sm">
                      <Icon name="Play" size={40} className="text-primary ml-1" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedChannel?.name}</h2>
                      <p className="text-white/70">{selectedChannel?.currentShow}</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Button size="icon" variant="ghost" className="text-white hover:text-primary">
                        <Icon name="Play" size={24} />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-white hover:text-primary">
                        <Icon name="Volume2" size={20} />
                      </Button>
                      <span className="text-white text-sm">20:15 / 21:00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant={quality === 'HD' ? 'default' : 'outline'}
                        onClick={() => setQuality('HD')}
                        className="text-xs"
                      >
                        HD
                      </Button>
                      <Button 
                        size="sm" 
                        variant={quality === 'SD' ? 'default' : 'outline'}
                        onClick={() => setQuality('SD')}
                        className="text-xs"
                      >
                        SD
                      </Button>
                      <Button size="icon" variant="ghost" className="text-white hover:text-primary">
                        <Icon name="Maximize" size={20} />
                      </Button>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-primary rounded-full" />
                  </div>
                </div>

                {selectedChannel?.isLive && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-accent text-white border-0 gap-1.5 animate-fade-in">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse-slow" />
                      LIVE
                    </Badge>
                  </div>
                )}

                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="backdrop-blur-sm">
                    {quality}
                  </Badge>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{selectedChannel?.currentShow}</h3>
                    <p className="text-sm text-muted-foreground">
                      Сейчас на канале {selectedChannel?.name}
                    </p>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => selectedChannel && toggleFavorite(selectedChannel.id)}
                  >
                    <Icon 
                      name="Heart" 
                      size={20} 
                      className={selectedChannel && favorites.includes(selectedChannel.id) ? 'fill-accent text-accent' : ''} 
                    />
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Clock" size={16} />
                  <span>Далее: {selectedChannel?.nextShow}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-card to-muted/30 border-border/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="Calendar" size={20} className="text-primary" />
                Расписание на сегодня
              </h3>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {mockSchedule.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-primary min-w-[60px]">{item.time}</span>
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors">{item.show}</p>
                          <p className="text-xs text-muted-foreground">{item.duration}</p>
                        </div>
                      </div>
                      <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                <TabsTrigger value="channels" className="gap-2">
                  <Icon name="Grid3x3" size={16} />
                  Каналы
                </TabsTrigger>
                <TabsTrigger value="favorites" className="gap-2">
                  <Icon name="Heart" size={16} />
                  Избранное
                </TabsTrigger>
                <TabsTrigger value="search" className="gap-2">
                  <Icon name="Search" size={16} />
                  Поиск
                </TabsTrigger>
              </TabsList>

              <TabsContent value="channels" className="mt-4">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="space-y-2 pr-4">
                    {mockChannels.map((channel) => (
                      <Card
                        key={channel.id}
                        className={`p-4 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg ${
                          selectedChannel?.id === channel.id 
                            ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary' 
                            : 'bg-card/50 hover:bg-card'
                        }`}
                        onClick={() => setSelectedChannel(channel)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl">
                            {channel.logo}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold truncate">{channel.name}</h4>
                              {channel.isLive && (
                                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-slow" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{channel.currentShow}</p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(channel.id);
                            }}
                          >
                            <Icon 
                              name="Heart" 
                              size={16} 
                              className={favorites.includes(channel.id) ? 'fill-accent text-accent' : ''} 
                            />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="favorites" className="mt-4">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="space-y-2 pr-4">
                    {favoriteChannels.length > 0 ? (
                      favoriteChannels.map((channel) => (
                        <Card
                          key={channel.id}
                          className="p-4 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg bg-card/50 hover:bg-card"
                          onClick={() => setSelectedChannel(channel)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl">
                              {channel.logo}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold truncate">{channel.name}</h4>
                                {channel.isLive && (
                                  <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-slow" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{channel.currentShow}</p>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Icon name="Heart" size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Нет избранных каналов</p>
                        <p className="text-sm mt-2">Добавьте каналы в избранное</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="search" className="mt-4 space-y-4">
                <div className="relative">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Поиск каналов и передач..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <ScrollArea className="h-[calc(100vh-340px)]">
                  <div className="space-y-2 pr-4">
                    {filteredChannels.length > 0 ? (
                      filteredChannels.map((channel) => (
                        <Card
                          key={channel.id}
                          className="p-4 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg bg-card/50 hover:bg-card"
                          onClick={() => setSelectedChannel(channel)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl">
                              {channel.logo}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold truncate">{channel.name}</h4>
                              <p className="text-xs text-muted-foreground truncate">{channel.currentShow}</p>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {channel.category}
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Icon name="SearchX" size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Ничего не найдено</p>
                        <p className="text-sm mt-2">Попробуйте другой запрос</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}