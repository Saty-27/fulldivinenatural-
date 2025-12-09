import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Heart, 
  Leaf, 
  BookOpen,
  Play,
  Award,
  Target,
  Calendar,
  TrendingUp,
  Droplets,
  Activity,
  Globe,
  Users,
  Share
} from "lucide-react";
import { Link } from "wouter";
import CustomerLayout from "@/components/layout/customer-layout";
import logoImage from "@assets/WhatsApp Image 2025-08-07 at 16.06.46_1755865958874.jpg";

export default function WellnessCommunity() {
  const [activeTab, setActiveTab] = useState("wellness");

  // Mock wellness data
  const wellnessStats = {
    dailyMilkConsumption: 1.5,
    weeklyGoal: 10,
    monthlyTarget: 45,
    currentMonth: 32,
    plasticSaved: 25,
    carbonFootprint: 12.5,
    healthScore: 85
  };

  const articles = [
    {
      id: 1,
      title: "Benefits of A2 Milk for Children",
      excerpt: "Discover why A2 milk is easier to digest and better for your child's development...",
      readTime: "5 min read",
      category: "Health",
      image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
    },
    {
      id: 2,
      title: "From Farm to Your Doorstep: Our Journey",
      excerpt: "Take a virtual tour of our partner farms and see how we ensure quality...",
      readTime: "8 min read",
      category: "Farm Story",
      image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
    },
    {
      id: 3,
      title: "Healthy Breakfast Recipes with Fresh Dairy",
      excerpt: "Start your day right with these nutritious recipes using our fresh products...",
      readTime: "6 min read",
      category: "Recipes",
      image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
    }
  ];

  const videos = [
    {
      id: 1,
      title: "How Our Cows Are Treated",
      duration: "3:45",
      thumbnail: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      views: "12.5K views"
    },
    {
      id: 2,
      title: "Making Fresh Paneer at Home",
      duration: "5:20",
      thumbnail: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      views: "8.3K views"
    }
  ];

  const communityPosts = [
    {
      id: 1,
      author: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b05b?w=50&h=50&fit=crop&crop=face",
      content: "My kids absolutely love the taste of Divine Naturals milk! It's creamy and fresh. Thank you for such quality products! 🥛❤️",
      likes: 24,
      time: "2 hours ago",
      image: null
    },
    {
      id: 2,
      author: "Rajesh Kumar",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      content: "Made fresh paneer using your milk today. The texture and taste were amazing! Here's my creation 👨‍🍳",
      likes: 18,
      time: "5 hours ago",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
    }
  ];

  const achievements = [
    { title: "Eco Warrior", description: "Saved 25+ plastic bags", icon: "🌱", unlocked: true },
    { title: "Health Champion", description: "Met monthly wellness goals", icon: "💪", unlocked: true },
    { title: "Community Helper", description: "Shared 5+ posts", icon: "🤝", unlocked: false },
    { title: "Recipe Master", description: "Tried 10+ recipes", icon: "👨‍🍳", unlocked: false }
  ];

  return (
    <CustomerLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-green-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-blue-50/50 opacity-60"></div>
          <div className="relative flex items-center space-x-4">
            <Link href="/home">
              <Button variant="ghost" size="icon" className="text-[var(--eco-primary)] flex-shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2 flex-shrink-0">
              <img 
                src={logoImage} 
                alt="Divine Naturals Tree Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-black text-[hsl(var(--eco-secondary))] mb-1 truncate">
                Wellness & Community
              </h1>
              <p className="text-base text-[hsl(var(--eco-text-muted))] font-semibold">
                Your health journey with nature
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger value="wellness" className="rounded-lg font-semibold">
              <Heart className="w-4 h-4 mr-2" />
              Wellness
            </TabsTrigger>
            <TabsTrigger value="learn" className="rounded-lg font-semibold">
              <BookOpen className="w-4 h-4 mr-2" />
              Learn
            </TabsTrigger>
            <TabsTrigger value="community" className="rounded-lg font-semibold">
              <Users className="w-4 h-4 mr-2" />
              Community
            </TabsTrigger>
          </TabsList>

          {/* Wellness Tab */}
          <TabsContent value="wellness" className="space-y-4">
            {/* Health Score Card */}
            <Card className="bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 text-white shadow-2xl border-0">
              <CardContent className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Your Health Score</h3>
                    <div className="text-4xl font-black mb-2">{wellnessStats.healthScore}/100</div>
                    <Badge className="bg-white/20 text-white border-white/30">Excellent</Badge>
                  </div>
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Heart className="w-10 h-10 text-green-100" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily & Monthly Goals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="eco-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Target className="w-5 h-5 mr-2" />
                    Daily Goal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Milk Consumption</span>
                      <span className="font-bold">{wellnessStats.dailyMilkConsumption}L / 2L</span>
                    </div>
                    <Progress value={75} className="w-full" />
                    <p className="text-sm text-green-600">Great! Almost reached your daily goal</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="eco-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    Monthly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>This Month</span>
                      <span className="font-bold">{wellnessStats.currentMonth}L / {wellnessStats.monthlyTarget}L</span>
                    </div>
                    <Progress value={(wellnessStats.currentMonth / wellnessStats.monthlyTarget) * 100} className="w-full" />
                    <p className="text-sm text-[hsl(var(--eco-text-muted))]">13L more to reach your target</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Eco Impact */}
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Globe className="w-5 h-5 mr-2" />
                  Your Eco Impact This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">🛍️</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{wellnessStats.plasticSaved}</div>
                    <div className="text-sm text-[hsl(var(--eco-text-muted))]">Plastic bags saved</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">🌍</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{wellnessStats.carbonFootprint}kg</div>
                    <div className="text-sm text-[hsl(var(--eco-text-muted))]">CO₂ reduced</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">🥛</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{wellnessStats.currentMonth}L</div>
                    <div className="text-sm text-[hsl(var(--eco-text-muted))]">Fresh milk consumed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="eco-card">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Award className="w-5 h-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      achievement.unlocked 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${
                            achievement.unlocked ? 'text-green-800' : 'text-gray-500'
                          }`}>
                            {achievement.title}
                          </h4>
                          <p className="text-sm text-[hsl(var(--eco-text-muted))]">
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.unlocked && (
                          <Badge className="bg-green-500 text-white">Unlocked</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learn Tab */}
          <TabsContent value="learn" className="space-y-4">
            {/* Featured Article */}
            <Card className="eco-card">
              <CardContent className="p-0">
                <img 
                  src="https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
                  alt="Featured article"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <Badge className="bg-blue-500 text-white mb-2">Featured</Badge>
                  <h3 className="text-xl font-bold text-[hsl(var(--eco-secondary))] mb-2">
                    The Science Behind A2 Milk
                  </h3>
                  <p className="text-[hsl(var(--eco-text-muted))] mb-4">
                    Understand the difference between A1 and A2 milk proteins and why A2 milk might be easier on your digestive system...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[hsl(var(--eco-text-muted))]">10 min read</span>
                    <Button className="eco-button-secondary">Read More</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Articles Grid */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[hsl(var(--eco-secondary))]">Health & Wellness Articles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {articles.map((article) => (
                  <Card key={article.id} className="eco-card">
                    <CardContent className="p-0">
                      <img 
                        src={article.image}
                        alt={article.title}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      <div className="p-4">
                        <Badge variant="outline" className="mb-2">{article.category}</Badge>
                        <h4 className="font-semibold text-[hsl(var(--eco-secondary))] mb-1">{article.title}</h4>
                        <p className="text-sm text-[hsl(var(--eco-text-muted))] mb-3">{article.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[hsl(var(--eco-text-muted))]">{article.readTime}</span>
                          <Button variant="ghost" size="sm">
                            <BookOpen className="w-4 h-4 mr-1" />
                            Read
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Educational Videos */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[hsl(var(--eco-secondary))]">Educational Videos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <Card key={video.id} className="eco-card">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img 
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-t-lg">
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                            <Play className="w-6 h-6 text-black ml-1" />
                          </div>
                        </div>
                        <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                          {video.duration}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-[hsl(var(--eco-secondary))] mb-1">{video.title}</h4>
                        <p className="text-xs text-[hsl(var(--eco-text-muted))]">{video.views}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-4">
            {/* Community Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="eco-card text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-[hsl(var(--eco-primary))]">2.5K+</div>
                  <div className="text-sm text-[hsl(var(--eco-text-muted))]">Community Members</div>
                </CardContent>
              </Card>
              <Card className="eco-card text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-[hsl(var(--eco-secondary))]">150+</div>
                  <div className="text-sm text-[hsl(var(--eco-text-muted))]">Stories Shared</div>
                </CardContent>
              </Card>
              <Card className="eco-card text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">98%</div>
                  <div className="text-sm text-[hsl(var(--eco-text-muted))]">Happy Customers</div>
                </CardContent>
              </Card>
            </div>

            {/* Create Post */}
            <Card className="eco-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                    alt="Your avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <Button variant="outline" className="w-full justify-start text-[hsl(var(--eco-text-muted))]">
                      Share your Divine Naturals experience...
                    </Button>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">📷 Photo</Button>
                  <Button variant="ghost" size="sm">📊 Recipe</Button>
                  <Button variant="ghost" size="sm">💡 Tip</Button>
                </div>
              </CardContent>
            </Card>

            {/* Community Posts */}
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <Card key={post.id} className="eco-card">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3 mb-3">
                      <img 
                        src={post.avatar}
                        alt={post.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-[hsl(var(--eco-secondary))]">{post.author}</span>
                          <span className="text-xs text-[hsl(var(--eco-text-muted))]">{post.time}</span>
                        </div>
                        <p className="text-[hsl(var(--eco-text-muted))]">{post.content}</p>
                      </div>
                    </div>
                    
                    {post.image && (
                      <img 
                        src={post.image}
                        alt="Post content"
                        className="w-full h-48 object-cover rounded-lg mb-3"
                      />
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <Button variant="ghost" size="sm" className="text-red-500">
                        ❤️ {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        💬 Comment
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CustomerLayout>
  );
}