export interface M3UChannel {
  id: number;
  name: string;
  logo: string;
  streamUrl: string;
  category: string;
  tvgId?: string;
  groupTitle?: string;
}

export function parseM3U(content: string): M3UChannel[] {
  const channels: M3UChannel[] = [];
  const lines = content.split('\n').map(line => line.trim());
  
  let currentChannel: Partial<M3UChannel> = {};
  let channelId = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('#EXTINF:')) {
      const nameMatch = line.match(/,(.+)$/);
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      const groupMatch = line.match(/group-title="([^"]+)"/);
      const idMatch = line.match(/tvg-id="([^"]+)"/);
      
      currentChannel = {
        id: channelId++,
        name: nameMatch ? nameMatch[1].trim() : `Канал ${channelId}`,
        logo: logoMatch ? logoMatch[1] : '📺',
        category: groupMatch ? groupMatch[1] : 'Общие',
        tvgId: idMatch ? idMatch[1] : undefined,
        groupTitle: groupMatch ? groupMatch[1] : undefined,
      };
    } else if (line && !line.startsWith('#') && currentChannel.name) {
      currentChannel.streamUrl = line;
      
      if (currentChannel.streamUrl) {
        channels.push({
          ...currentChannel,
          id: currentChannel.id || channelId++,
          name: currentChannel.name,
          logo: currentChannel.logo || '📺',
          streamUrl: currentChannel.streamUrl,
          category: currentChannel.category || 'Общие',
        } as M3UChannel);
      }
      
      currentChannel = {};
    }
  }
  
  return channels;
}

export async function loadM3UFromUrl(url: string): Promise<M3UChannel[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    return parseM3U(content);
  } catch (error) {
    console.error('Failed to load M3U from URL:', error);
    throw error;
  }
}

export function loadM3UFromFile(file: File): Promise<M3UChannel[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const channels = parseM3U(content);
        resolve(channels);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
