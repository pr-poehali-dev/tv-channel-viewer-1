import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { loadM3UFromFile, loadM3UFromUrl, M3UChannel } from '@/lib/m3uParser';
import { useToast } from '@/hooks/use-toast';

interface PlaylistLoaderProps {
  onPlaylistLoad: (channels: M3UChannel[]) => void;
}

export default function PlaylistLoader({ onPlaylistLoad }: PlaylistLoaderProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const channels = await loadM3UFromFile(file);
      onPlaylistLoad(channels);
      toast({
        title: 'Плейлист загружен',
        description: `Добавлено ${channels.length} каналов`,
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить плейлист из файла',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlLoad = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    try {
      const channels = await loadM3UFromUrl(url);
      onPlaylistLoad(channels);
      toast({
        title: 'Плейлист загружен',
        description: `Добавлено ${channels.length} каналов`,
      });
      setOpen(false);
      setUrl('');
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить плейлист по URL',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Icon name="Upload" size={18} />
          Загрузить плейлист
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Загрузить M3U плейлист</DialogTitle>
          <DialogDescription>
            Загрузите плейлист из файла или укажите URL-ссылку
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">Из файла</TabsTrigger>
            <TabsTrigger value="url">По URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="file" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Выберите файл M3U</Label>
              <Input
                id="file"
                type="file"
                accept=".m3u,.m3u8"
                onChange={handleFileUpload}
                disabled={isLoading}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              <p>Поддерживаемые форматы: .m3u, .m3u8</p>
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL плейлиста</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/playlist.m3u"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button 
              onClick={handleUrlLoad} 
              disabled={!url.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <Icon name="Download" size={18} className="mr-2" />
                  Загрузить
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
