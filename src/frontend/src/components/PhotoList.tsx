import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Trash2 } from "lucide-react";
import type { PhotoItem } from "../App";

interface PhotoListProps {
  photos: PhotoItem[];
  onRemove: (id: string) => void;
}

export default function PhotoList({ photos, onRemove }: PhotoListProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Added Photos
            <Badge variant="secondary" className="ml-3">
              {photos.length} {photos.length === 1 ? "photo" : "photos"}
            </Badge>
          </h2>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative rounded-lg border bg-card overflow-hidden transition-all hover:shadow-md"
              >
                <div className="absolute top-2 left-2 z-10">
                  <Badge variant="secondary" className="font-semibold">
                    #{index + 1}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onRemove(photo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={photo.imageData}
                    alt={photo.locationName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-3 space-y-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium line-clamp-2">
                      {photo.locationName}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(photo.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
