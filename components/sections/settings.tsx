"use client"

import { Settings, Palette, Globe, Bell, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useTheme } from "@/components/theme-provider"
import { useFavorites } from "@/hooks/use-favorites"
import { useWatchlist } from "@/hooks/use-watchlist"
import { useState } from "react"

const colorThemes = [
  { id: "default", label: "Default (Neutral)" },
  { id: "ocean", label: "Ocean (Blue)" },
  { id: "forest", label: "Forest (Green)" },
  { id: "sunset", label: "Sunset (Orange)" },
  { id: "lavender", label: "Lavender (Purple)" },
  { id: "ruby", label: "Ruby (Red)" },
]

const languages = [
  { id: "hindi", label: "Hindi" },
  { id: "telugu", label: "Telugu" },
  { id: "tamil", label: "Tamil" },
  { id: "malayalam", label: "Malayalam" },
  { id: "kannada", label: "Kannada" },
  { id: "english", label: "English" },
]

export function SettingsSection() {
  const { theme, colorTheme, setTheme, setColorTheme } = useTheme()
  const { favorites, clearFavorites } = useFavorites()
  const { watchlist, clearWatchlist } = useWatchlist()
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>([])

  const toggleLanguage = (langId: string) => {
    setPreferredLanguages((prev) =>
      prev.includes(langId) ? prev.filter((l) => l !== langId) : [...prev, langId]
    )
  }

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-muted">
          <Settings className="h-6 w-6 text-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Settings</h2>
          <p className="text-sm text-muted-foreground">Customize your MovieBot experience</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Appearance */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="theme-mode">Theme Mode</Label>
              <Select value={theme} onValueChange={(v: "light" | "dark" | "system") => setTheme(v)}>
                <SelectTrigger id="theme-mode" className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="color-theme">Color Theme</Label>
              <Select value={colorTheme} onValueChange={setColorTheme}>
                <SelectTrigger id="color-theme" className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorThemes.map((ct) => (
                    <SelectItem key={ct.id} value={ct.id}>
                      {ct.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Language Preferences */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4 text-primary" />
              Language Preferences
            </CardTitle>
            <CardDescription>Select your preferred film languages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {languages.map((lang) => (
                <label
                  key={lang.id}
                  className="flex items-center gap-2 rounded-lg border border-border p-3 bg-background hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <Checkbox
                    checked={preferredLanguages.includes(lang.id)}
                    onCheckedChange={() => toggleLanguage(lang.id)}
                  />
                  <span className="text-sm font-medium">{lang.label}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <label className="flex items-center gap-3 rounded-lg border border-border p-3 bg-background hover:bg-accent/50 transition-colors cursor-pointer">
                <Checkbox defaultChecked />
                <div>
                  <span className="text-sm font-medium">New Releases</span>
                  <p className="text-xs text-muted-foreground">Get notified about new movie releases</p>
                </div>
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-border p-3 bg-background hover:bg-accent/50 transition-colors cursor-pointer">
                <Checkbox defaultChecked />
                <div>
                  <span className="text-sm font-medium">Recommendations</span>
                  <p className="text-xs text-muted-foreground">Personalized movie suggestions</p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trash2 className="h-4 w-4 text-primary" />
              Data Management
            </CardTitle>
            <CardDescription>Manage your saved data</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
              <div>
                <p className="text-sm font-medium">Favorites</p>
                <p className="text-xs text-muted-foreground">{favorites.length} movies saved</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFavorites}
                disabled={favorites.length === 0}
                className="text-destructive hover:text-destructive"
              >
                Clear
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
              <div>
                <p className="text-sm font-medium">Watchlist</p>
                <p className="text-xs text-muted-foreground">{watchlist.length} movies saved</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearWatchlist}
                disabled={watchlist.length === 0}
                className="text-destructive hover:text-destructive"
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
