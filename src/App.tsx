import React, { useState, useEffect, useMemo } from 'react';
import { 
  Pizza, 
  ShoppingBag, 
  Phone, 
  Heart, 
  Star, 
  MapPin, 
  Clock, 
  Send, 
  Info, 
  ChevronRight, 
  Plus, 
  Minus, 
  Trash2, 
  Percent, 
  Lock, 
  Menu, 
  X, 
  MessageSquare, 
  Award, 
  Check, 
  RefreshCw,
  Sparkles,
  Flame,
  UtensilsCrossed,
  Droplet,
  Edit2,
  Settings,
  PlusCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Interfaces
interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'signature' | 'chicken' | 'beef' | 'stuffed' | 'sides' | 'drinks';
  prices: {
    Small?: number;
    Medium: number;
    Large?: number;
  };
  image: string;
  rating: number;
  orders: number;
  spicy?: boolean;
  chefSpecial?: boolean;
  bestSeller?: boolean;
}

interface CartItem {
  id: string; // id-size key
  menuId: string;
  name: string;
  size: 'Small' | 'Medium' | 'Large';
  price: number;
  quantity: number;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  review: string;
  rating: number;
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'fajita',
    name: 'Max Fajita Supreme',
    description: 'Spicy marinated chicken fajita strips, bell peppers, caramelized sweet onions, smoked mozzarella & hot peri drizzle.',
    category: 'chicken',
    prices: { Small: 950, Medium: 1450, Large: 1950 },
    image: '/src/assets/images/max_fajita_supreme_1790678747710.jpg',
    rating: 5.0,
    orders: 1420,
    chefSpecial: true
  },
  {
    id: 'pepperoni',
    name: 'Smoked Pepperoni Truffle',
    description: 'Double artisan beef pepperoni cups, white truffle infused olive oil, San Marzano marinara, & aged parmesan crisp.',
    category: 'beef',
    prices: { Small: 1100, Medium: 1650, Large: 2250 },
    image: '/src/assets/images/pepperoni_truffle_1790678761566.jpg',
    rating: 4.9,
    orders: 2150,
    bestSeller: true
  },
  {
    id: 'tikka',
    name: 'Creamy Chicken Tikka Delight',
    description: 'Char-grilled smoky chicken chunks, rich garlic cream drizzle, roasted jalapeños & cheese stuffed crust ring.',
    category: 'stuffed',
    prices: { Small: 1050, Medium: 1550, Large: 2100 },
    image: '/src/assets/images/chicken_tikka_delight_1790678774501.jpg',
    rating: 4.95,
    orders: 980,
    chefSpecial: true
  },
  {
    id: 'margherita',
    name: 'The Obsidian Margherita',
    description: 'Heirloom tomatoes, fresh organic buffalo mozzarella pearls, sweet basil leaves, cold-press virgin olive oil & charcoal dust.',
    category: 'signature',
    prices: { Small: 850, Medium: 1290, Large: 1750 },
    image: '/src/assets/images/obsidian_margherita_1790678786959.jpg',
    rating: 4.85,
    orders: 1100
  },
  {
    id: 'brisket',
    name: 'Smoked Beef Brisket Feast',
    description: 'Slow-smoked pulled beef brisket, molasses BBQ drizzle, sweet charred corn, sharp mature white cheddar & green onions.',
    category: 'beef',
    prices: { Small: 1200, Medium: 1790, Large: 2390 },
    image: '/src/assets/images/beef_brisket_feast_1790679429231.jpg',
    rating: 4.9,
    orders: 1250,
    bestSeller: true
  },
  {
    id: 'veggie',
    name: 'Sriracha Veggie Glow',
    description: 'Roasted portobello mushrooms, sweet bell peppers, caramelized onions, kalamata olives, sriracha drizzle & fresh herbs.',
    category: 'signature',
    prices: { Small: 900, Medium: 1350, Large: 1850 },
    image: '/src/assets/images/sriracha_veggie_glow_1790679444182.jpg',
    rating: 4.8,
    orders: 870
  },
  {
    id: 'fries',
    name: 'Max Loaded Curly Fries',
    description: 'Double-fried spiraled potatoes coated in house cajun spice, liquid mozzarella gold drizzle & chopped fresh green chives.',
    category: 'sides',
    prices: { Medium: 490 },
    image: '/src/assets/images/max_loaded_fries_1790679459773.jpg',
    rating: 4.9,
    orders: 3400,
    bestSeller: true
  },
  {
    id: 'strips',
    name: 'Mozzarella Hearth Pulls',
    description: 'Panko-crusted aged whole milk mozzarella sticks served with spicy San Marzano tomato dip.',
    category: 'sides',
    prices: { Medium: 590 },
    image: '/src/assets/images/mozzarella_hearth_pulls_1790679473725.jpg',
    rating: 4.8,
    orders: 1850
  },
  {
    id: 'cooler',
    name: 'Wild Berry Mint Cooler',
    description: 'Handcrafted sparkling tonic infused with wild forest berries, muddled fresh spearmint, lime, and crushed ice.',
    category: 'drinks',
    prices: { Medium: 380 },
    image: '/src/assets/images/wild_berry_cooler_1790679487846.jpg',
    rating: 5.0,
    orders: 650,
    chefSpecial: true
  },
  {
    id: 'stoutcola',
    name: 'Artisanal Stout Cola',
    description: 'Small-batch micro-brewed sugar cane cola, infused with dark vanilla bean extracts & sparkling water.',
    category: 'drinks',
    prices: { Medium: 290 },
    image: '/src/assets/images/artisanal_stout_cola_1790679501692.jpg',
    rating: 4.7,
    orders: 1150
  }
];

export default function App() {
  // Navigation active tab / scroll path
  const [activeTab, setActiveTab] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Menu Items State backed by localStorage (CRUD)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('pizzamax_menu_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((item: MenuItem) => {
          const match = DEFAULT_MENU_ITEMS.find((d) => d.id === item.id);
          if (match && item.image.includes('unsplash.com')) {
            return { ...item, image: match.image };
          }
          return item;
        });
      } catch (e) {
        return DEFAULT_MENU_ITEMS;
      }
    }
    return DEFAULT_MENU_ITEMS;
  });

  // Save menu state changes persistently
  useEffect(() => {
    localStorage.setItem('pizzamax_menu_v2', JSON.stringify(menuItems));
  }, [menuItems]);

  // Admin Dashboard States (CRUD Panel)
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  // CRUD Form fields state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<MenuItem['category']>('signature');
  const [formPriceSmall, setFormPriceSmall] = useState('');
  const [formPriceMedium, setFormPriceMedium] = useState('');
  const [formPriceLarge, setFormPriceLarge] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formChefSpecial, setFormChefSpecial] = useState(false);
  const [formBestSeller, setFormBestSeller] = useState(false);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'fajita-Medium',
      menuId: 'fajita',
      name: 'Max Fajita Supreme',
      size: 'Medium',
      price: 1450,
      quantity: 1
    },
    {
      id: 'fries-Medium',
      menuId: 'fries',
      name: 'Max Loaded Curly Fries',
      size: 'Medium',
      price: 490,
      quantity: 2
    }
  ]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [voucherApplied, setVoucherApplied] = useState<boolean>(false);
  const [voucherDiscount, setVoucherDiscount] = useState<number>(0); // fraction, e.g. 0.20
  
  // WhatsApp Quick Order state backed by localStorage
  const [customerName, setCustomerName] = useState<string>(() => {
    return localStorage.getItem('pizzamax_cust_name') || '';
  });
  const [customerAddress, setCustomerAddress] = useState<string>(() => {
    return localStorage.getItem('pizzamax_cust_address') || '';
  });
  const [customerPhone, setCustomerPhone] = useState<string>(() => {
    return localStorage.getItem('pizzamax_cust_phone') || '';
  });
  const [orderInstructions, setOrderInstructions] = useState<string>('');

  // Persist customer profile changes
  useEffect(() => {
    localStorage.setItem('pizzamax_cust_name', customerName);
  }, [customerName]);
  useEffect(() => {
    localStorage.setItem('pizzamax_cust_address', customerAddress);
  }, [customerAddress]);
  useEffect(() => {
    localStorage.setItem('pizzamax_cust_phone', customerPhone);
  }, [customerPhone]);
  
  // Menu filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Selected sizes on item cards (map of menuId -> size)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, 'Small' | 'Medium' | 'Large'>>({
    'fajita': 'Medium',
    'pepperoni': 'Medium',
    'tikka': 'Medium',
    'margherita': 'Medium',
    'brisket': 'Medium',
    'veggie': 'Medium'
  });

  // Lightbox gallery
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string; description: string } | null>(null);

  // Auto-sliding Testimonial Index
  const [testimonialIndex, setTestimonialIndex] = useState<number>(0);

  // Toast Notifications
  const [toast, setToast] = useState<{ visible: boolean; message: string; icon?: React.ReactNode }>({
    visible: false,
    message: ''
  });

  const deals = [
    {
      id: 'deal-family',
      title: 'Family Feast Masterclass',
      description: '2 Large Artisanal Pizzas + 1 Garlic Herb Breadstick Basket + 1.5L Chilled Soft Drink.',
      price: 3299,
      oldPrice: 4399,
      discountText: 'SAVE 25%',
      badge: '★ FESTIVAL SPECIAL',
      icon: <Award className="w-6 h-6 text-brand-gold" />
    },
    {
      id: 'deal-duo',
      title: 'Duo Indulgence Combo',
      description: '1 Medium Signature Pizza + 2 Signature Truffle Dips + 2 Craft Beverage Cans.',
      price: 1850,
      oldPrice: 2310,
      discountText: 'SAVE 20%',
      badge: '★ PERFECT MATCH',
      icon: <Heart className="w-6 h-6 text-brand-red" />
    },
    {
      id: 'deal-student',
      title: 'Student Crunch Box',
      description: '1 Small Hand-Tossed Pizza + 1 Regular Crispy Fries + 1 Chilled 330ml Can.',
      price: 999,
      oldPrice: 1290,
      discountText: 'SAVE 22%',
      badge: '★ CAMPUS HIT',
      icon: <Sparkles className="w-6 h-6 text-amber-500" />
    },
    {
      id: 'deal-mega',
      title: 'Mega Max Party Pack',
      description: '3 Jumbo Pizzas (Any Flavors) + 12pc Glazed Wings Platter + 2x 1.5L Chilled Soft Drinks.',
      price: 5499,
      oldPrice: 7200,
      discountText: 'SAVE 24%',
      badge: '★ BLOCKBUSTER FEAST',
      icon: <Pizza className="w-6 h-6 text-brand-gold" />
    }
  ];

  const galleryImages = [
    {
      src: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800',
      alt: 'Artisanal Woodfire Pizza',
      description: 'Our hand-stretched 48-hour fermented dough blistering inside the 800°F stone oven.'
    },
    {
      src: 'https://images.unsplash.com/photo-1594009244524-cf2b21394335?q=80&w=800',
      alt: 'Mozzarella Cheese Pull',
      description: '100% pure premium Wisconsin mozzarella stretching gracefully from a hot slice.'
    },
    {
      src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800',
      alt: 'Gourmet Pizza Assembly',
      description: 'Fresh organic basil leaves, heirloom tomatoes and premium olive oil added pre-fire.'
    },
    {
      src: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800',
      alt: 'Hot Pepperoni Box',
      description: 'Crisp pepperoni cups locking in aromatic smoked oils ready for immediate hot dispatch.'
    }
  ];

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Ahmed Khan',
      role: 'Verified Food Critic',
      review: 'The crust alone is pure poetry. Crispy, airy, blistered char with unmatched chew. The Smoked Pepperoni Truffle is now our weekly family ritual! Hands down the best in town.',
      rating: 5
    },
    {
      id: 2,
      name: 'Sarah Mansoor',
      role: 'Top Epicurean & Regular',
      review: 'Ordering through their 1-tap WhatsApp was unbelievably smooth. Pizza arrived steaming hot in 26 minutes on a bustling Friday evening! Extremely helpful dispatch staff.',
      rating: 5
    },
    {
      id: 3,
      name: 'Taimoor Raza',
      role: 'Gastronomy Blogger',
      review: 'You can taste the genuine high-quality Wisconsin cheese instantly. No synthetic oily blending. And the Max Loaded Curly Fries are beautifully spiced and crunchy.',
      rating: 5
    }
  ];

  // Auto-rotating Testimonial loop
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Helper function to trigger elegant toast
  const triggerToast = (message: string, icon?: React.ReactNode) => {
    setToast({ visible: true, message, icon });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2500);
  };

  // Cart Handlers
  const handleAddToCart = (item: MenuItem, size: 'Small' | 'Medium' | 'Large' = 'Medium') => {
    const price = item.prices[size] || item.prices.Medium;
    const cartId = `${item.id}-${size}`;
    
    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.id === cartId);
      if (existing) {
        return prevCart.map((ci) => 
          ci.id === cartId ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [
        ...prevCart,
        {
          id: cartId,
          menuId: item.id,
          name: item.name,
          size,
          price,
          quantity: 1
        }
      ];
    });
    
    triggerToast(`Added ${item.name} (${size}) to your manifest`, <Check className="w-5 h-5 text-brand-gold" />);
  };

  const handleAddComboToCart = (deal: typeof deals[0]) => {
    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.id === deal.id);
      if (existing) {
        return prevCart.map((ci) => 
          ci.id === deal.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [
        ...prevCart,
        {
          id: deal.id,
          menuId: deal.id,
          name: deal.title,
          size: 'Medium',
          price: deal.price,
          quantity: 1
        }
      ];
    });
    triggerToast(`Added ${deal.title} to your cart`, <Award className="w-5 h-5 text-brand-gold" />);
  };

  const updateCartQuantity = (cartId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === cartId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  // Voucher validation
  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (voucherCode.toUpperCase() === 'MAXCHEF20') {
      setVoucherApplied(true);
      setVoucherDiscount(0.20);
      triggerToast('Secret 20% Discount Voucher Unlocked!', <Percent className="w-5 h-5 text-brand-gold" />);
    } else {
      triggerToast('Voucher unrecognized. Try code: MAXCHEF20', <X className="w-5 h-5 text-brand-red" />);
    }
  };

  // Math totals
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return Math.round(subtotal * voucherDiscount);
  }, [subtotal, voucherDiscount]);

  const taxAmount = useMemo(() => {
    // 13% standard tax
    return Math.round((subtotal - discountAmount) * 0.13);
  }, [subtotal, discountAmount]);

  const totalAmount = useMemo(() => {
    return (subtotal - discountAmount) + taxAmount;
  }, [subtotal, discountAmount, taxAmount]);

  const cartTotalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  // Favorite toggle
  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites((prev) => prev.filter((f) => f !== id));
      triggerToast('Removed from VIP list');
    } else {
      setFavorites((prev) => [...prev, id]);
      triggerToast('Added to VIP favorites!', <Heart className="w-5 h-5 text-brand-red fill-current" />);
    }
  };

  // Filter Menu Items
  const filteredMenu = useMemo(() => {
    if (selectedCategory === 'all') return menuItems;
    return menuItems.filter((item) => item.category === selectedCategory);
  }, [selectedCategory, menuItems]);

  // Size change update
  const handleSizeChange = (menuId: string, size: 'Small' | 'Medium' | 'Large') => {
    setSelectedSizes((prev) => ({ ...prev, [menuId]: size }));
  };

  // WhatsApp Message Payload Builder
  const generatedWhatsAppMessage = useMemo(() => {
    let orderList = '';
    cart.forEach((item) => {
      const sizeStr = item.size !== 'Medium' || item.id.includes('deal') ? ` (${item.size})` : '';
      orderList += `* ${item.name}${sizeStr} × ${item.quantity} - Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
    });

    const isDiscounted = voucherApplied ? `\nDiscount Applied: Rs. ${discountAmount.toLocaleString()} (20% OFF)` : '';

    return `Hello Pizza Max! 🍕\n\n` +
      `I would like to order the following fresh wood-fired feast:\n\n` +
      `${orderList}` +
      `---------------------------------\n` +
      `Subtotal: Rs. ${subtotal.toLocaleString()}` +
      `${isDiscounted}\n` +
      `GST Tax (13%): Rs. ${taxAmount.toLocaleString()}\n` +
      `*Estimated Total: Rs. ${totalAmount.toLocaleString()}*\n\n` +
      `*Customer Profile:*\n` +
      `👤 Name: ${customerName || 'Not specified'}\n` +
      `📍 Delivery Address: ${customerAddress || 'Not specified'}\n` +
      `📞 Phone: ${customerPhone || 'Not specified'}\n` +
      `💡 Note: ${orderInstructions || 'No special instructions'}\n\n` +
      `Please confirm my dispatch and send the Live Order Tracker link immediately! Quick order triggered via Pizza Max Portal.`;
  }, [cart, subtotal, discountAmount, taxAmount, totalAmount, customerName, customerAddress, customerPhone, orderInstructions, voucherApplied]);

  // Action: Launch WhatsApp order
  const triggerWhatsAppDispatch = () => {
    if (cart.length === 0) {
      triggerToast('Your shopping cart is currently empty!', <ShoppingBag className="w-5 h-5 text-brand-red" />);
      return;
    }
    const encoded = encodeURIComponent(generatedWhatsAppMessage);
    window.open(`https://wa.me/923000007499?text=${encoded}`, '_blank');
    triggerToast('Redirecting to WhatsApp dispatch...', <Send className="w-5 h-5 text-brand-gold" />);
  };

  // Form submission simulated
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('Message received! Our team will contact you shortly.', <Check className="w-5 h-5 text-brand-gold" />);
    (e.target as HTMLFormElement).reset();
  };

  // CRUD Operation Handlers (Create, Update, Delete)
  const handleOpenCreateForm = () => {
    setEditingItem(null);
    setFormName('');
    setFormDescription('');
    setFormCategory('signature');
    setFormPriceSmall('');
    setFormPriceMedium('');
    setFormPriceLarge('');
    setFormImage('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600');
    setFormChefSpecial(false);
    setFormBestSeller(false);
    
    // Smooth scroll to the CRUD form
    document.getElementById('kitchen-editor')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDescription(item.description);
    setFormCategory(item.category);
    setFormPriceSmall(item.prices.Small ? item.prices.Small.toString() : '');
    setFormPriceMedium(item.prices.Medium.toString());
    setFormPriceLarge(item.prices.Large ? item.prices.Large.toString() : '');
    setFormImage(item.image);
    setFormChefSpecial(!!item.chefSpecial);
    setFormBestSeller(!!item.bestSeller);

    // Smooth scroll to the CRUD form
    document.getElementById('kitchen-editor')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formName.trim() || !formPriceMedium) {
      triggerToast('Name & Base (M) Price are mandatory!', <X className="w-5 h-5 text-brand-red" />);
      return;
    }

    const pricesObj: MenuItem['prices'] = {
      Medium: Number(formPriceMedium)
    };
    if (formPriceSmall) pricesObj.Small = Number(formPriceSmall);
    if (formPriceLarge) pricesObj.Large = Number(formPriceLarge);

    if (editingItem) {
      // UPDATE: Save edits to existing item
      setMenuItems((prev) => 
        prev.map((item) => {
          if (item.id === editingItem.id) {
            return {
              ...item,
              name: formName,
              description: formDescription,
              category: formCategory,
              prices: pricesObj,
              image: formImage || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600',
              chefSpecial: formChefSpecial,
              bestSeller: formBestSeller
            };
          }
          return item;
        })
      );
      triggerToast(`Successfully modified ${formName}!`, <Check className="w-5 h-5 text-brand-gold" />);
    } else {
      // CREATE: Generate a new custom item
      const newItemId = 'custom-' + Date.now();
      const newItem: MenuItem = {
        id: newItemId,
        name: formName,
        description: formDescription,
        category: formCategory,
        prices: pricesObj,
        image: formImage || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600',
        rating: 5.0,
        orders: 1,
        chefSpecial: formChefSpecial,
        bestSeller: formBestSeller
      };
      setMenuItems((prev) => [...prev, newItem]);
      triggerToast(`Successfully created ${formName}!`, <Plus className="w-5 h-5 text-brand-gold" />);
    }

    // Reset forms
    setEditingItem(null);
    setFormName('');
    setFormDescription('');
    setFormPriceSmall('');
    setFormPriceMedium('');
    setFormPriceLarge('');
    setFormImage('');
    setFormChefSpecial(false);
    setFormBestSeller(false);
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the live menu?`)) {
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      triggerToast(`Removed "${name}" from Hearth Menu`, <Trash2 className="w-5 h-5 text-brand-red" />);
      
      // Also remove from cart if present to prevent errors
      setCart((prevCart) => prevCart.filter((ci) => ci.menuId !== id));
    }
  };

  const handleResetDefaultMenu = () => {
    if (window.confirm('Do you want to restore the original 10 Pizza Max masterclass recipes? This will overwrite your current changes.')) {
      setMenuItems(DEFAULT_MENU_ITEMS);
      localStorage.removeItem('pizzamax_menu_v2');
      triggerToast('Menu reset to defaults!', <RefreshCw className="w-5 h-5 text-brand-gold animate-spin" />);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D] text-white selection:bg-brand-red selection:text-white">
      
      {/* ==================== GLOBAL HEADER ==================== */}
      <header className="sticky top-0 left-0 right-0 z-40 bg-[#0D0D0D]/90 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-[1360px] mx-auto h-20 px-4 md:px-8 flex items-center justify-between">
          
          {/* Zone 1: Brand Wordmark (Single-element wordmark) */}
          <div className="flex items-center gap-3">
            <a 
              href="#" 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 group text-white hover:text-brand-gold transition-colors focus-visible:outline-none"
            >
              <Pizza className="w-8 h-8 text-brand-red group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-display text-xl font-bold tracking-widest uppercase">
                Pizza Max
              </span>
            </a>
          </div>

          {/* Zone 2: Navigation Links (4-6 clean text links) */}
          <nav className="hidden lg:flex items-center gap-6">
            <a 
              href="#hero" 
              className={`text-sm font-medium transition-colors ${activeTab === 'home' ? 'text-brand-gold' : 'text-white/60 hover:text-white'}`}
              onClick={() => setActiveTab('home')}
            >
              Home
            </a>
            <a 
              href="#menu" 
              className={`text-sm font-medium transition-colors ${activeTab === 'menu' ? 'text-brand-gold' : 'text-white/60 hover:text-white'}`}
              onClick={() => setActiveTab('menu')}
            >
              Artisanal Menu
            </a>
            <a 
              href="#deals" 
              className={`text-sm font-medium transition-colors ${activeTab === 'deals' ? 'text-brand-gold' : 'text-white/60 hover:text-white'}`}
              onClick={() => setActiveTab('deals')}
            >
              Exquisite Deals
            </a>
            <a 
              href="#kitchen-control" 
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${activeTab === 'kitchen' ? 'text-brand-gold' : 'text-white/60 hover:text-white'}`}
              onClick={() => {
                setActiveTab('kitchen');
                setIsAdminMode(true);
                document.getElementById('kitchen-control')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Settings className="w-4 h-4 text-brand-gold animate-spin-slow" />
              <span>Kitchen Control Deck</span>
            </a>
            <a 
              href="#gallery" 
              className={`text-sm font-medium transition-colors ${activeTab === 'gallery' ? 'text-brand-gold' : 'text-white/60 hover:text-white'}`}
              onClick={() => setActiveTab('gallery')}
            >
              Visual Gallery
            </a>
            <a 
              href="#about" 
              className={`text-sm font-medium transition-colors ${activeTab === 'about' ? 'text-brand-gold' : 'text-white/60 hover:text-white'}`}
              onClick={() => setActiveTab('about')}
            >
              Our Craft
            </a>
          </nav>

          {/* Zone 3: Primary Actions (1-2 main actions) */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                triggerToast(isAdminMode ? 'Switched to Standard Customer Mode' : 'Switched to Admin Kitchen Mode', <Settings className="w-5 h-5 text-brand-gold" />);
                if(!isAdminMode) {
                  setActiveTab('kitchen');
                  setTimeout(() => {
                    document.getElementById('kitchen-control')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                } else {
                  setActiveTab('home');
                }
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brand-gold/30 hover:border-brand-gold bg-white/5 hover:bg-white/10 text-brand-gold text-xs font-bold transition-all cursor-pointer uppercase"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{isAdminMode ? 'Exit Admin' : 'Admin Area'}</span>
            </button>

            <a 
              href="tel:111-MAX-PIZZA" 
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-brand-gold text-sm font-semibold transition-all border border-white/5"
            >
              <Phone className="w-4 h-4" />
              <span>111-MAX-PIZZA</span>
            </a>
            
            {/* Cart Trigger */}
            <button 
              onClick={() => setCartOpen(true)}
              className="relative p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center border border-white/5 cursor-pointer"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5 text-brand-gold" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-red font-body text-[10px] font-bold text-white shadow-lg animate-pulse">
                  {cartTotalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Backdrop & Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm z-50 bg-[#0D0D0D] p-6 flex flex-col justify-between border-l border-white/10 shadow-2xl lg:hidden"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-bold tracking-widest text-brand-gold uppercase">Pizza Max</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-white/60 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <nav className="flex flex-col gap-6">
                  {['home', 'menu', 'deals', 'kitchen', 'gallery', 'about', 'contact'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        if (tab === 'kitchen') {
                          setIsAdminMode(true);
                          setActiveTab('kitchen');
                          document.getElementById('kitchen-control')?.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          setActiveTab(tab);
                        }
                        setMobileMenuOpen(false);
                      }}
                      className="text-left text-lg font-medium text-white/80 hover:text-brand-gold capitalize transition-colors"
                    >
                      {tab === 'about' ? 'Our Craft' : tab === 'deals' ? 'Exquisite Deals' : tab === 'kitchen' ? 'Kitchen Deck (CRUD)' : tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10">
                <a 
                  href="tel:111-MAX-PIZZA" 
                  className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl bg-white/5 border border-white/10 font-semibold text-brand-gold"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call 111-MAX-PIZZA</span>
                </a>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCartOpen(true);
                  }}
                  className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl bg-brand-red font-semibold text-white shadow-xl"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Open Basket ({cartTotalItems})</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full">
        
        {/* ==================== HERO SECTION ==================== */}
        <section id="hero" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-12 pb-20">
          
          {/* Ambient Woodfire Background Layer with Dark Scrim */}
          <div className="absolute inset-0 z-0 scale-105 transition-transform duration-1000 ease-out">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1600&auto=format&fit=crop')` }}
            />
            {/* Multi-layered Glassmorphic Scrims for Rich Texture & Premium Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/85 to-[#0D0D0D]/70 backdrop-blur-[3px]" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0D0D0D]/40 to-[#0D0D0D]" />
          </div>

          {/* Sparking Embers Dynamic Accent Glimmer */}
          <div className="absolute inset-0 pointer-events-none z-10 opacity-40">
            <div className="absolute w-[450px] h-[450px] rounded-full bg-brand-red/15 blur-[120px] top-1/4 left-10 animate-pulse-slow" />
            <div className="absolute w-[380px] h-[380px] rounded-full bg-brand-gold/10 blur-[100px] bottom-1/4 right-10 animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
          </div>

          {/* Hero Content Grid */}
          <div className="relative z-10 max-w-[1360px] w-full mx-auto px-4 md:px-8 flex flex-col items-center text-center">
            
            {/* High-Impact Proof Micro-Labels */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 font-body text-xs font-semibold tracking-wider text-brand-gold uppercase">
                <Flame className="w-3.5 h-3.5 text-brand-red fill-current animate-pulse" />
                Hot Hearth Fire in 30 Min
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 font-body text-xs font-semibold tracking-wider text-white uppercase">
                <Star className="w-3.5 h-3.5 text-brand-gold fill-current" />
                4.9/5 Rating (15k+ Reviews)
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 font-body text-xs font-semibold tracking-wider text-brand-gold uppercase">
                Free Delivery Above Rs. 1,500
              </span>
            </div>

            {/* Slogan Title */}
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] max-w-5xl mb-6 text-wrap-balance">
              The Alchemy of <span className="text-brand-red">Fire &amp; Flour</span>. <br />
              <span className="text-brand-gold italic font-display font-normal">Savor Wood-Fired Perfection.</span>
            </h1>

            {/* Explanatory Body Copy */}
            <p className="font-body text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              Experience slow-fermented 48-hour sourdough, charred at 800°F in our signature stone hearth ovens, and loaded with 100% molten mozzarella.
            </p>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <a 
                href="#menu" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-red text-white font-semibold text-base shadow-[0_0_30px_rgba(225,6,0,0.45)] hover:shadow-[0_0_40px_rgba(225,6,0,0.65)] hover:bg-brand-red/90 transition-all text-center flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Pizza className="w-5 h-5" />
                <span>Explore Artisanal Menu</span>
              </a>
              <button 
                onClick={() => {
                  setIsAdminMode(true);
                  setActiveTab('kitchen');
                  document.getElementById('kitchen-control')?.scrollIntoView({ behavior: 'smooth' });
                  triggerToast('Administrative Hearth Control Deck Loaded', <Settings className="w-5 h-5 text-brand-gold animate-spin-slow" />);
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-brand-gold font-semibold text-base transition-all text-center border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Settings className="w-5 h-5" />
                <span>Open Kitchen Control (CRUD)</span>
              </button>
            </div>

            {/* Scroll Indicator */}
            <a 
              href="#whatsapp-builder" 
              className="mt-16 flex flex-col items-center gap-2 text-white/40 hover:text-brand-gold transition-colors group"
            >
              <span className="font-body text-[10px] font-bold tracking-widest uppercase">Explore Direct Dispatch</span>
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center p-1.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
              </motion.div>
            </a>

          </div>
        </section>

        {/* ==================== WHATSAPP FAST ORDER BUILDER ==================== */}
        <section id="whatsapp-builder" className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-16 scroll-mt-24">
          <div className="relative w-full rounded-3xl bg-white/[0.02] border border-white/5 p-6 md:p-10 lg:p-12 shadow-[0_24px_64px_rgba(0,0,0,0.8)] overflow-hidden">
            
            {/* Soft backdrop radial glow */}
            <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-brand-gold/10 blur-[100px] pointer-events-none" />
            <div className="absolute -left-24 -top-24 w-96 h-96 rounded-full bg-brand-red/15 blur-[120px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              
              {/* Profile setup details */}
              <div className="lg:col-span-5 space-y-4">
                <span className="inline-block text-brand-gold text-xs font-bold tracking-widest uppercase">
                  EXPRESS DISPATCH CONCIERGE
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-semibold text-white leading-tight">
                  1-Tap Instant WhatsApp Dispatch
                </h2>
                <p className="font-body text-base text-white/70 leading-relaxed">
                  Skip tedious account generation and standard app forms. Type your details below to instantly craft and generate your bespoke gourmet payload directly to our WhatsApp dispatcher.
                </p>
                
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <Check className="w-5 h-5 text-brand-gold" />
                    <span>Instant kitchen acknowledgment</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <Check className="w-5 h-5 text-brand-gold" />
                    <span>Direct cash on delivery or link payment</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <Check className="w-5 h-5 text-brand-gold" />
                    <span>Real-time delivery courier tracker</span>
                  </div>
                </div>
              </div>

              {/* Form Input Columns */}
              <div className="lg:col-span-7 bg-[#121212]/90 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-body text-[10px] font-bold tracking-widest text-brand-gold uppercase">
                      LIVESTREAM DISPATCH BOT READY
                    </span>
                  </div>
                  <span className="font-body text-xs text-white/40">Dispatcher: +92 300 000 7499</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block font-body text-xs font-bold text-white/60 uppercase tracking-wider" htmlFor="cust-name">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      id="cust-name"
                      placeholder="Ahmed Ali" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-body text-xs font-bold text-white/60 uppercase tracking-wider" htmlFor="cust-phone">
                      Contact Phone
                    </label>
                    <input 
                      type="tel" 
                      id="cust-phone"
                      placeholder="0300 1234567" 
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-body text-xs font-bold text-white/60 uppercase tracking-wider" htmlFor="cust-address">
                    Precise Delivery Address
                  </label>
                  <input 
                    type="text" 
                    id="cust-address"
                    placeholder="Apartment 4B, Block C, Phase 5, DHA, Karachi" 
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-body text-xs font-bold text-white/60 uppercase tracking-wider" htmlFor="cust-notes">
                    Special Baking / Delivery Instructions
                  </label>
                  <textarea 
                    id="cust-notes"
                    rows={2}
                    placeholder="Make the chicken extra spicy, double marinara, and knock when you arrive instead of ringing bell." 
                    value={orderInstructions}
                    onChange={(e) => setOrderInstructions(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-gold transition-colors resize-none"
                  />
                </div>

                {/* Simulated Order Draft Payload */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <span className="block font-body text-[10px] font-bold text-brand-gold uppercase tracking-wider">
                    PAYLOAD PREVIEW DRAFT:
                  </span>
                  <div className="font-mono text-xs text-white/50 max-h-24 overflow-y-auto whitespace-pre-wrap no-scrollbar">
                    {generatedWhatsAppMessage}
                  </div>
                </div>

                {/* Subtotal summary and submit trigger */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="text-left w-full sm:w-auto">
                    <span className="block font-body text-[10px] text-white/40 uppercase tracking-wider">Estimated Due</span>
                    <span className="font-body text-xl font-bold text-brand-gold">Rs. {totalAmount.toLocaleString()}</span>
                  </div>

                  <button 
                    onClick={triggerWhatsAppDispatch}
                    className="w-full sm:w-auto px-6 py-4 rounded-xl bg-brand-red text-white hover:bg-brand-red/90 font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-3 shadow-[0_0_24px_rgba(225,6,0,0.3)] hover:shadow-[0_0_35px_rgba(225,6,0,0.5)] transition-all cursor-pointer active:scale-95"
                  >
                    <MessageSquare className="w-5 h-5 fill-current" />
                    <span>Instant WhatsApp Order</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ==================== ADMINISTRATIVE KITCHEN CONTROL PANEL (CRUD) ==================== */}
        {isAdminMode && (
          <section id="kitchen-control" className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-16 scroll-mt-24 border-y border-brand-gold/10 bg-[#121212]/30 rounded-3xl my-12">
            <div className="space-y-8">
              
              {/* CRUD Panel Header */}
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 text-brand-gold text-xs font-bold tracking-widest uppercase mb-2">
                    <Settings className="w-4 h-4 animate-spin-slow" />
                    SYSTEM LEVEL MANAGERS AREA
                  </span>
                  <h2 className="font-display text-3xl font-bold text-white">
                    Hearth Kitchen Control Deck (CRUD)
                  </h2>
                  <p className="font-body text-sm text-white/60 mt-1 max-w-2xl">
                    Create, update, customize, and delete the menu selections shown across the live customer portal instantly. Changes survive page reloads and persist in local storage.
                  </p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <button 
                    onClick={handleResetDefaultMenu}
                    className="px-4 py-2.5 rounded-lg text-xs font-bold uppercase bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset to Defaults
                  </button>
                  <button
                    onClick={handleOpenCreateForm}
                    className="px-4 py-2.5 rounded-lg text-xs font-bold uppercase bg-brand-gold hover:bg-brand-gold/90 text-black transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-brand-gold/15"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Create New Pizza/Item
                  </button>
                </div>
              </div>

              {/* CRUD Interactive Form Panel */}
              <div id="kitchen-editor" className="bg-[#161616] rounded-2xl border border-brand-gold/20 p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <h3 className="font-display text-lg font-bold text-brand-gold flex items-center gap-2">
                    {editingItem ? <Edit2 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                    <span>{editingItem ? `Modify Recipe: ${editingItem.name}` : 'Form: Build a Fresh Recipe Creation'}</span>
                  </h3>
                  {editingItem && (
                    <button 
                      onClick={() => setEditingItem(null)}
                      className="text-xs text-white/40 hover:text-white underline cursor-pointer"
                    >
                      Cancel Editing
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveItem} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Name, Category, Image fields */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">Item Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Garlic Jalapeno Melt"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">Culinary Category</label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value as MenuItem['category'])}
                          className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
                        >
                          <option value="signature">Signature Base</option>
                          <option value="chicken">Chicken Craft</option>
                          <option value="beef">Beef &amp; Truffle</option>
                          <option value="stuffed">Stuffed Crust</option>
                          <option value="sides">Crisps &amp; Appetizers</option>
                          <option value="drinks">Craft Beverages</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">Gastronomy Description</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Detail the fermented base dough, specific cheese string blends, imported truffle coatings or local spices..."
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">Food Image URL</label>
                        <input 
                          type="url" 
                          placeholder="Paste a link from unsplash or pexels"
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
                        />
                      </div>
                      
                      {/* Checkbox triggers */}
                      <div className="flex items-center gap-6 h-full pt-6">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none text-sm font-semibold">
                          <input 
                            type="checkbox" 
                            checked={formChefSpecial}
                            onChange={(e) => setFormChefSpecial(e.target.checked)}
                            className="w-4 h-4 rounded accent-brand-gold bg-white/5"
                          />
                          <span className="text-brand-gold">Chef Special Banner</span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer select-none text-sm font-semibold">
                          <input 
                            type="checkbox" 
                            checked={formBestSeller}
                            onChange={(e) => setFormBestSeller(e.target.checked)}
                            className="w-4 h-4 rounded accent-brand-red bg-white/5"
                          />
                          <span className="text-brand-red">Best Seller Badge</span>
                        </label>
                      </div>
                    </div>

                  </div>

                  {/* Price Configurations Column */}
                  <div className="lg:col-span-4 bg-[#1C1C1C] rounded-xl p-5 border border-white/5 space-y-4 flex flex-col justify-between">
                    <div>
                      <h4 className="font-body text-xs font-bold text-white/50 uppercase tracking-widest border-b border-white/5 pb-2 mb-4">
                        Price Configurations (Rs.)
                      </h4>

                      <div className="space-y-3.5">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-white/40 uppercase">Small (S) Crust Price</label>
                          <input 
                            type="number" 
                            placeholder="e.g. 950 (optional)"
                            value={formPriceSmall}
                            onChange={(e) => setFormPriceSmall(e.target.value)}
                            className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-brand-gold uppercase">Medium (M) Crust Price *</label>
                          <input 
                            type="number" 
                            required
                            placeholder="e.g. 1450 (mandatory)"
                            value={formPriceMedium}
                            onChange={(e) => setFormPriceMedium(e.target.value)}
                            className="w-full bg-[#121212] border border-brand-gold/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-white/40 uppercase">Large (L) Crust Price</label>
                          <input 
                            type="number" 
                            placeholder="e.g. 1950 (optional)"
                            value={formPriceLarge}
                            onChange={(e) => setFormPriceLarge(e.target.value)}
                            className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white font-bold text-xs uppercase tracking-widest transition-all mt-4 cursor-pointer"
                    >
                      {editingItem ? 'Save Recipe Changes' : 'Create Recipe Item'}
                    </button>
                  </div>
                </form>
              </div>

              {/* CRUD Live Item Inventory list (Read & Delete and edit selectors) */}
              <div className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-5 border-b border-white/5 bg-white/[0.01]">
                  <h3 className="font-display text-base font-semibold text-white">
                    Live Menu Inventory Stream ({menuItems.length} active creations)
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-white/80 border-collapse">
                    <thead>
                      <tr className="bg-white/5 font-body text-xs text-white/40 uppercase tracking-wider border-b border-white/5">
                        <th className="py-3 px-5">Active Dish Details</th>
                        <th className="py-3 px-5">Category</th>
                        <th className="py-3 px-5">Crust Prices (Rs.)</th>
                        <th className="py-3 px-5">Highlight Flags</th>
                        <th className="py-3 px-5 text-right">Interactive Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {menuItems.map((item) => (
                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors font-body">
                          {/* Image & Title Column */}
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-4.5">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-12 h-12 rounded-lg object-cover bg-white/5 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="font-bold text-white text-sm truncate">{item.name}</div>
                                <div className="text-xs text-white/50 truncate max-w-sm">{item.description}</div>
                              </div>
                            </div>
                          </td>
                          {/* Category Column */}
                          <td className="py-3 px-5 text-xs text-brand-gold uppercase tracking-wider">
                            {item.category}
                          </td>
                          {/* Prices Column */}
                          <td className="py-3 px-5 text-xs font-mono tabular-nums text-white">
                            {item.prices.Small && `S: ${item.prices.Small} · `}
                            M: {item.prices.Medium}
                            {item.prices.Large && ` · L: ${item.prices.Large}`}
                          </td>
                          {/* Badge flags */}
                          <td className="py-3 px-5 text-[10px] uppercase font-bold">
                            {item.chefSpecial && <span className="text-brand-gold block">★ Chef Special</span>}
                            {item.bestSeller && <span className="text-brand-red block">★ Best Seller</span>}
                            {!item.chefSpecial && !item.bestSeller && <span className="text-white/40 block">Classic</span>}
                          </td>
                          {/* Actions Column */}
                          <td className="py-3 px-5 text-right space-x-2">
                            <button
                              onClick={() => handleSelectEditItem(item)}
                              className="p-2 rounded bg-white/5 hover:bg-brand-gold hover:text-black text-brand-gold transition-all cursor-pointer"
                              title="Edit item values"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id, item.name)}
                              className="p-2 rounded bg-white/5 hover:bg-brand-red hover:text-white text-white/55 transition-all cursor-pointer"
                              title="Delete from menu"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* ==================== EXPLORE MENU & INTERACTIVE CATEGORIES ==================== */}
        <section id="menu" className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-16 scroll-mt-24">
          
          {/* Header titles */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-red" />
                <span className="font-body text-xs font-bold text-brand-red uppercase tracking-widest">
                  STONE-OVEN SELECTIONS
                </span>
              </div>
              <h2 className="font-display text-4xl font-semibold text-white">
                Artisanal Gastronomy Menu
              </h2>
            </div>
            <p className="font-body text-white/60 max-w-md leading-relaxed text-sm">
              Explore authentic signature wood-fired baking. Every item is hand-prepared with the finest local and imported components.
            </p>
          </div>

          {/* Interactive Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-10 border-b border-white/5">
            {[
              { id: 'all', label: 'All Creations' },
              { id: 'signature', label: 'Signature Base' },
              { id: 'chicken', label: 'Chicken Craft' },
              { id: 'beef', label: 'Beef & Truffle' },
              { id: 'stuffed', label: 'Stuffed Crust' },
              { id: 'sides', label: 'Crisps & Appetizers' },
              { id: 'drinks', label: 'Craft Beverages' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full font-body text-xs font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat.id 
                    ? 'bg-brand-red text-white shadow-md shadow-brand-red/25' 
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8 pt-8">
            {filteredMenu.map((item) => {
              const currentSize = selectedSizes[item.id] || 'Medium';
              const price = item.prices[currentSize] || item.prices.Medium;
              const hasSizes = !!item.prices.Small;

              return (
                <div 
                  key={item.id} 
                  className="group relative bg-[#121212]/60 backdrop-blur-md rounded-2xl p-6 pt-16 shadow-xl border border-white/5 hover:border-brand-gold/25 transition-all duration-300 flex flex-col justify-between animate-fade-in"
                >
                  {/* Floating Circular Image Breaking Boundary */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-6 bg-[#161616]">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Badges / Header Details */}
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-3 text-xs">
                      {/* Zero-Pill unboxed typography with elegant markers */}
                      <span className="font-body text-[10px] font-bold tracking-wider text-brand-gold uppercase">
                        {item.chefSpecial ? '★ CHEF EXCLUSIVE' : item.bestSeller ? '★ BEST SELLER' : '★ CLASSIC CRAFT'}
                      </span>
                      
                      <button 
                        onClick={() => toggleFavorite(item.id)}
                        className="text-white/40 hover:text-brand-red transition-colors cursor-pointer p-1"
                        aria-label="Add to favorites"
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(item.id) ? 'text-brand-red fill-current' : ''}`} />
                      </button>
                    </div>

                    <h3 className="font-display text-xl font-semibold text-white group-hover:text-brand-gold transition-colors duration-300">
                      {item.name}
                    </h3>
                    
                    <p className="font-body text-sm text-white/60 line-clamp-2 mt-2 mb-4 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Star Rating Indicator */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-brand-gold">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      {/* Zero-Pill metadata rendering with subtle separators */}
                      <span className="font-body text-xs text-white/40">
                        {item.rating.toFixed(1)} · {item.orders}+ Ordered
                      </span>
                    </div>

                    {/* Size Selector Controls */}
                    {hasSizes && (
                      <div className="flex items-center gap-2 mb-6 p-1 bg-white/5 rounded-xl">
                        {(['Small', 'Medium', 'Large'] as const).map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeChange(item.id, size)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                              currentSize === size 
                                ? 'bg-white/10 text-brand-gold shadow-sm' 
                                : 'text-white/40 hover:text-white'
                            }`}
                          >
                            {size === 'Small' ? 'S' : size === 'Medium' ? 'M' : 'L'}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom / Price & Action */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="block font-body text-[10px] text-white/40 uppercase tracking-widest">
                        ESTIMATED PRICE
                      </span>
                      <span className="font-body text-lg font-bold text-brand-gold">
                        Rs. {price.toLocaleString()}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(item, currentSize)}
                      className="px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-brand-red/10 cursor-pointer active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </section>

        {/* ==================== EXQUISITE DEALS SECTION ==================== */}
        <section id="deals" className="w-full bg-[#0D0D0D]/40 py-20 border-y border-white/5 scroll-mt-24">
          <div className="max-w-[1360px] mx-auto px-4 md:px-8">
            
            {/* Header titles */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-body text-xs font-bold text-brand-gold uppercase tracking-widest block mb-2">
                LIMITED-TIME CELEBRATED COMBOS
              </span>
              <h2 className="font-display text-4xl font-semibold text-white mb-4">
                Curated Value Feasts
              </h2>
              <p className="font-body text-white/60 text-base leading-relaxed">
                Expertly matched pizza pairings combined with premium appetizers &amp; beverages to satisfy midnight movie binging, friends gatherings, or family parties.
              </p>
            </div>

            {/* Deals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {deals.map((deal) => (
                <div 
                  key={deal.id}
                  className="relative bg-[#121212] rounded-2xl p-6 border border-white/5 hover:border-brand-gold/20 transition-all duration-300 flex flex-col justify-between shadow-xl group"
                >
                  {/* Floating Discount Tag */}
                  <div className="absolute top-4 right-4 text-xs font-bold font-body text-brand-gold tracking-wider uppercase">
                    {deal.discountText}
                  </div>

                  <div>
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-brand-gold mb-5 group-hover:scale-110 transition-transform">
                      {deal.icon}
                    </div>

                    {/* Zero-Pill unboxed tag */}
                    <span className="block font-body text-[10px] font-bold text-brand-gold uppercase tracking-wider mb-2">
                      {deal.badge}
                    </span>

                    <h3 className="font-display text-lg font-semibold text-white group-hover:text-brand-gold transition-colors duration-300 mb-2">
                      {deal.title}
                    </h3>

                    <p className="font-body text-xs text-white/60 leading-relaxed mb-6">
                      {deal.description}
                    </p>
                  </div>

                  {/* Lower Checkout Details */}
                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-body text-xl font-bold text-brand-gold">
                        Rs. {deal.price.toLocaleString()}
                      </span>
                      <span className="font-body text-xs text-white/40 line-through">
                        Rs. {deal.oldPrice.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddComboToCart(deal)}
                      className="w-full py-3 rounded-xl bg-white/5 hover:bg-brand-gold hover:text-black text-brand-gold font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                    >
                      <Award className="w-4 h-4" />
                      <span>Claim Feast Deal</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ==================== THE STORY & QUALITY COMMITMENT ==================== */}
        <section id="about" className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-20 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Column */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800" 
                  alt="Pizza Max dough preparation and organic basil" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/90 via-[#0D0D0D]/20 to-transparent" />
                
                {/* Floating Micro Info Tag */}
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-[#121212]/90 border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center text-black font-body text-sm font-extrabold shrink-0 shadow-lg">
                      48h
                    </span>
                    <div>
                      <h4 className="font-body text-sm font-bold text-white">Cold Fermentation Heritage</h4>
                      <p className="font-body text-xs text-white/60 mt-0.5">Airy, easily digestible sourdough with classic leopard blistered spot crust.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Badge Overlay */}
              <div className="hidden sm:flex absolute -bottom-4 -right-4 bg-[#161616] border border-brand-gold/20 p-4 rounded-xl shadow-2xl items-center gap-3">
                <Award className="w-8 h-8 text-brand-gold shrink-0" />
                <div>
                  <div className="font-body text-sm font-bold text-white">Certified Real Cheese</div>
                  <div className="font-body text-[10px] text-white/40 uppercase tracking-widest mt-0.5">100% Mozzarella Blend</div>
                </div>
              </div>
            </div>

            {/* Editorial Copy Column */}
            <div className="lg:col-span-6 space-y-6">
              <span className="font-body text-xs font-bold text-brand-red uppercase tracking-widest block">
                UNCOMPROMISING HERITAGE
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-white leading-tight">
                Authentic Baking Rituals Built for Pure Indulgence
              </h2>
              <p className="font-body text-base text-white/70 leading-relaxed">
                At Pizza Max, we believe pizza making is a culinary ritual. We honor time-tested sourdough methods, stretching our discs exclusively by hand on premium Italian semolina flour. No mechanical dough rollers, no frozen bases, and absolutely no artificial preservatives.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <Flame className="w-6 h-6 text-brand-red mb-2" />
                  <h4 className="font-body text-sm font-bold text-white">800°F Stone Ovens</h4>
                  <p className="font-body text-xs text-white/60 mt-1">Baked extremely fast in intense heat to retain perfect inside crust moisture and bubble char.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <Droplet className="w-6 h-6 text-brand-gold mb-2" />
                  <h4 className="font-body text-sm font-bold text-white">Cold-Pressed Oils</h4>
                  <p className="font-body text-xs text-white/60 mt-1">Drizzled exclusively with premium virgin olive oil and chef-crafted spice infusions.</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ==================== GALLERY VISUAL REASONS SECTION ==================== */}
        <section id="gallery" className="w-full bg-[#0D0D0D]/20 py-20 border-y border-white/5 scroll-mt-24">
          <div className="max-w-[1360px] mx-auto px-4 md:px-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="font-body text-xs font-bold text-brand-gold uppercase tracking-widest block mb-2">
                  VISUAL STONE-OVEN DIARY
                </span>
                <h2 className="font-display text-4xl font-semibold text-white">
                  Gourmet Gallery Spotlight
                </h2>
              </div>
              <span className="font-body text-sm text-white/50">
                Click any spotlight below to view detailed baking descriptions.
              </span>
            </div>

            {/* Grid Spotlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {galleryImages.map((img, i) => (
                <div 
                  key={i}
                  onClick={() => setLightboxImage(img)}
                  className="relative group rounded-2xl overflow-hidden aspect-square border border-white/5 shadow-lg cursor-pointer"
                >
                  <img 
                    src={img.src} 
                    alt={img.alt} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#0D0D0D]/50 opacity-40 group-hover:opacity-0 transition-opacity" />
                  
                  {/* Glass Card Hover Text Overlay */}
                  <div className="absolute inset-x-4 bottom-4 p-4 rounded-xl bg-[#121212]/90 border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between">
                    <span className="font-body text-[10px] font-bold text-brand-gold uppercase tracking-wider">
                      Stone Oven Room
                    </span>
                    <h4 className="font-body text-sm font-bold text-white mt-1">
                      {img.alt}
                    </h4>
                    <span className="text-white/40 text-[11px] font-body flex items-center gap-1 mt-2">
                      <span>View details</span>
                      <ChevronRight className="w-3 h-3 text-brand-gold" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ==================== TESTIMONIALS SLIDING CAROUSEL ==================== */}
        <section className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <span className="font-body text-xs font-bold text-brand-red uppercase tracking-widest block">
              TESTIMONIAL STORIES
            </span>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex justify-center text-brand-gold gap-1">
                  {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-current" />
                  ))}
                </div>

                <blockquote className="font-display text-2xl md:text-3xl font-medium text-white/90 italic leading-relaxed text-wrap-balance">
                  “{testimonials[testimonialIndex].review}”
                </blockquote>

                <div className="pt-4 space-y-1">
                  <div className="font-body text-base font-bold text-white">
                    {testimonials[testimonialIndex].name}
                  </div>
                  <div className="font-body text-xs text-brand-gold uppercase tracking-widest flex items-center justify-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-brand-gold" />
                    {testimonials[testimonialIndex].role}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Dots */}
            <div className="flex items-center justify-center gap-2.5 pt-4">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    testimonialIndex === i ? 'w-8 bg-brand-gold' : 'w-2.5 bg-white/15 hover:bg-white/35'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

          </div>
        </section>

        {/* ==================== CONTACT, MOCK MAP, & HOURS ==================== */}
        <section id="contact" className="w-full bg-[#121212]/30 py-20 border-t border-white/5 scroll-mt-24">
          <div className="max-w-[1360px] mx-auto px-4 md:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Form Input Container */}
              <div className="lg:col-span-6 space-y-8">
                <div>
                  <span className="font-body text-xs font-bold text-brand-red uppercase tracking-widest block mb-2">
                    REACH THE HEARTH ROOM
                  </span>
                  <h2 className="font-display text-3xl font-semibold text-white">
                    Contact &amp; Reservation Desk
                  </h2>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block font-body text-xs font-bold text-white/60 uppercase tracking-wider" htmlFor="contact-name">
                        Your Name
                      </label>
                      <input 
                        type="text" 
                        required
                        id="contact-name"
                        placeholder="Ahmed Ali"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block font-body text-xs font-bold text-white/60 uppercase tracking-wider" htmlFor="contact-email">
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        required
                        id="contact-email"
                        placeholder="ahmed@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-body text-xs font-bold text-white/60 uppercase tracking-wider" htmlFor="contact-subject">
                      Subject Inquiry
                    </label>
                    <input 
                      type="text" 
                      required
                      id="contact-subject"
                      placeholder="Catering Inquiry or Franchise Request"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-body text-xs font-bold text-white/60 uppercase tracking-wider" htmlFor="contact-msg">
                      Bespoke Message
                    </label>
                    <textarea 
                      required
                      id="contact-msg"
                      rows={4}
                      placeholder="Type details of your request here..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-brand-gold border border-white/10 font-semibold text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message Payload</span>
                  </button>
                </form>
              </div>

              {/* Hours and Dark Map Graphic */}
              <div className="lg:col-span-6 space-y-8 flex flex-col justify-between">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#121212] p-6 border border-white/5 rounded-2xl shadow-xl">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-wider">
                      <Clock className="w-4 h-4" />
                      <span>Opening Hours</span>
                    </div>
                    <p className="font-body text-sm text-white/80">Monday - Sunday</p>
                    <p className="font-body text-sm text-white/60">11:00 AM - 03:00 AM</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-wider">
                      <MapPin className="w-4 h-4" />
                      <span>Flagship Oven</span>
                    </div>
                    <p className="font-body text-sm text-white/80">94 Woodfire Boulevard</p>
                    <p className="font-body text-sm text-white/60">Culinary District, DHA</p>
                  </div>
                </div>

                {/* High Fidelity Dark Map Mockup with Brand glow marker */}
                <div className="relative rounded-2xl overflow-hidden bg-[#161616] border border-white/5 p-4 flex-1 min-h-[250px] flex flex-col justify-end">
                  
                  {/* Simulated map lines using SVG background */}
                  <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <path d="M0,80 Q100,120 200,60 T400,100" fill="none" stroke="white" strokeWidth="3" />
                    <path d="M80,0 Q120,100 60,200 T100,400" fill="none" stroke="white" strokeWidth="2" />
                  </svg>

                  {/* Radiating Beacon Pin */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <span className="relative flex h-6 w-6">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-6 w-6 bg-brand-red border-2 border-white flex items-center justify-center">
                        <Pizza className="w-3 h-3 text-white fill-current" />
                      </span>
                    </span>
                    <span className="mt-2 text-xs font-bold bg-[#0D0D0D] px-2.5 py-1 rounded border border-white/10 tracking-widest uppercase text-brand-gold">
                      Pizza Max Hearth
                    </span>
                  </div>

                  <div className="relative z-10 p-4 rounded-xl bg-[#0D0D0D]/90 border border-white/10 backdrop-blur-md">
                    <div className="flex justify-between items-center text-xs text-white/50">
                      <span>Coordinates: 24.8607° N, 67.0011° E</span>
                      <span className="text-brand-gold font-bold">LIVE DISPATCH ACTIVE</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

      </main>

      {/* ==================== STICKY MOBILE NAVIGATION (15% Max Height Protected) ==================== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#0D0D0D]/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2">
        <a 
          href="#hero" 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-full text-center ${activeTab === 'home' ? 'text-brand-gold' : 'text-white/50'}`}
        >
          <Pizza className="w-5 h-5" />
          <span className="font-body text-[9px] font-medium uppercase tracking-wider">Home</span>
        </a>
        <a 
          href="#menu" 
          onClick={() => setActiveTab('menu')}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-full text-center ${activeTab === 'menu' ? 'text-brand-gold' : 'text-white/50'}`}
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span className="font-body text-[9px] font-medium uppercase tracking-wider">Menu</span>
        </a>
        <a 
          href="#deals" 
          onClick={() => setActiveTab('deals')}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-full text-center ${activeTab === 'deals' ? 'text-brand-gold' : 'text-white/50'}`}
        >
          <Award className="w-5 h-5" />
          <span className="font-body text-[9px] font-medium uppercase tracking-wider">Deals</span>
        </a>
        <button 
          onClick={() => {
            setIsAdminMode(true);
            setActiveTab('kitchen');
            document.getElementById('kitchen-control')?.scrollIntoView({ behavior: 'smooth' });
            triggerToast('Switched to Kitchen Dashboard Panel', <Settings className="w-5 h-5 text-brand-gold animate-spin-slow" />);
          }}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-full text-center ${activeTab === 'kitchen' ? 'text-brand-gold' : 'text-white/50'}`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-body text-[9px] font-medium uppercase tracking-wider">CRUD</span>
        </button>
        <button 
          onClick={() => setCartOpen(true)}
          className="relative flex flex-col items-center justify-center gap-1 w-14 h-full text-center text-white/50"
        >
          <ShoppingBag className="w-5 h-5 text-brand-gold" />
          <span className="font-body text-[9px] font-medium uppercase tracking-wider text-brand-gold">Basket</span>
          {cartTotalItems > 0 && (
            <span className="absolute top-2 right-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-red font-body text-[8px] font-bold text-white shadow-md">
              {cartTotalItems}
            </span>
          )}
        </button>
      </nav>

      {/* ==================== PERSISTENT WHATSAPP ASSIST CHIP (DESKTOP) ==================== */}
      <aside className="hidden lg:flex fixed bottom-8 right-8 z-40 items-center group">
        <div className="relative flex items-center gap-3 px-5 py-3 rounded-full bg-[#161616] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:bg-[#1C1C1C] transition-all duration-300">
          <span className="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-brand-red font-body text-[8px] font-bold tracking-widest text-white uppercase animate-pulse">
            DIRECT PAYLOAD DISPATCH
          </span>
          <button 
            onClick={triggerWhatsAppDispatch}
            className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white shadow-lg cursor-pointer shrink-0"
            aria-label="Direct dispatch order draft"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
          </button>
          <div className="text-left font-body">
            <div className="text-xs font-bold text-white tracking-wide">Ready to Dispatch</div>
            <div className="text-[10px] text-white/40 uppercase mt-0.5">Click for Direct WhatsApp</div>
          </div>
        </div>
      </aside>

      {/* ==================== GLOBAL FOOTER ==================== */}
      <footer className="w-full bg-[#090909] border-t border-white/5 pt-20 pb-32 lg:pb-20">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-16">
            
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-2.5">
                <Pizza className="w-7 h-7 text-brand-red" />
                <span className="font-display text-lg font-bold tracking-widest uppercase text-brand-gold">
                  Pizza Max
                </span>
              </div>
              <p className="font-body text-sm text-white/60 leading-relaxed max-w-sm">
                Authentic wood-fired stone oven gastronomy, crafted clean with slow-fermented 48h sourdough, fresh local ingredients, and unadulterated whole milk mozzarella.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a href="#" className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-brand-gold transition-colors" aria-label="Instagram">
                  <span className="font-body text-xs font-bold">IG</span>
                </a>
                <a href="#" className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-brand-gold transition-colors" aria-label="Facebook">
                  <span className="font-body text-xs font-bold">FB</span>
                </a>
                <a href="#" className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-brand-gold transition-colors" aria-label="Twitter">
                  <span className="font-body text-xs font-bold">X</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-body text-xs font-bold text-brand-gold tracking-widest uppercase">Quick Links</h3>
              <ul className="space-y-2.5">
                <li><a href="#menu" className="font-body text-sm text-white/55 hover:text-brand-gold transition-colors">Artisanal Menu</a></li>
                <li><a href="#deals" className="font-body text-sm text-white/55 hover:text-brand-gold transition-colors">Feast Combos</a></li>
                <li><a href="#gallery" className="font-body text-sm text-white/55 hover:text-brand-gold transition-colors">Visual Gallery</a></li>
                <li><a href="#about" className="font-body text-sm text-white/55 hover:text-brand-gold transition-colors">Our Baking Heritage</a></li>
                <li><a href="#contact" className="font-body text-sm text-white/55 hover:text-brand-gold transition-colors">Dispatch Locations</a></li>
              </ul>
            </div>

            <div className="lg:col-span-3 space-y-4">
              <h3 className="font-body text-xs font-bold text-brand-gold tracking-widest uppercase">Hearth Service</h3>
              <div className="space-y-2">
                <div className="text-xs text-white/40 uppercase tracking-wider">Kitchen Hotline</div>
                <div className="font-body text-sm font-semibold text-white">111-MAX-PIZZA (629-749)</div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-white/40 uppercase tracking-wider">HQ Coordinate</div>
                <div className="font-body text-sm text-white/70">94 Woodfire Blvd, Culinary District</div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-4">
              <h3 className="font-body text-xs font-bold text-brand-gold tracking-widest uppercase">VIP Newsfeed</h3>
              <p className="font-body text-xs text-white/60 leading-relaxed">
                Unlock exclusive chef releases, invitations to private oven tasting sessions, and secret midnight codes.
              </p>
              
              <form onSubmit={(e) => { e.preventDefault(); triggerToast('Subscribed! Check your email for secret VIP gifts.', <Sparkles className="w-5 h-5 text-brand-gold" />); }} className="flex gap-2">
                <input 
                  type="email" 
                  required 
                  placeholder="name@example.com"
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-brand-gold flex-1"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-brand-red hover:bg-brand-red/90 text-white rounded-lg text-xs font-bold uppercase transition-colors"
                >
                  Join
                </button>
              </form>
            </div>

          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-white/40 font-body">
            <p>© {new Date().getFullYear()} Pizza Max Gastronomy LLC. Handcrafted with wood-fired passion.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-brand-gold transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand-gold transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-brand-gold transition-colors">Nutritional Transparency</a>
            </div>
          </div>

        </div>
      </footer>

      {/* ==================== INTERACTIVE SLIDE-OVER BASKET DRAWER ==================== */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop filter overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md cursor-pointer"
            />
            {/* Slide up/left sheet */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 bg-[#0D0D0D]/95 border-l border-white/10 backdrop-blur-2xl shadow-2xl p-6 flex flex-col justify-between"
            >
              
              {/* Header */}
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-brand-gold" />
                    <h3 className="font-display text-lg font-bold text-white tracking-wide">
                      Your Order Manifest
                    </h3>
                  </div>
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close basket"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Cart list stream */}
                <div className="space-y-4 py-6 max-h-[45vh] overflow-y-auto no-scrollbar font-body">
                  {cart.length === 0 ? (
                    <div className="py-12 text-center space-y-4">
                      <Pizza className="w-12 h-12 text-white/10 mx-auto" />
                      <p className="text-sm text-white/40">Your basket is currently empty.</p>
                      <button 
                        onClick={() => { setCartOpen(false); window.location.href = "#menu"; }}
                        className="text-xs font-bold text-brand-gold uppercase tracking-wider hover:underline"
                      >
                        Explore Menu Selections
                      </button>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div 
                        key={item.id}
                        className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4 animate-fade-in"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-white truncate">
                            {item.name}
                          </h4>
                          {/* Zero-Pill inline metadata with typographic separators */}
                          <span className="text-xs text-brand-gold">
                            Rs. {item.price.toLocaleString()} {item.size !== 'Medium' && `· ${item.size}`}
                          </span>
                        </div>

                        {/* Conjoined Stepper pill */}
                        <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                          <button 
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="text-brand-gold font-bold text-xs p-1 hover:text-white transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white px-1 select-none tabular-nums">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="text-brand-gold font-bold text-xs p-1 hover:text-white transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Promo code & Totals summary block */}
              <div className="space-y-4 border-t border-white/5 pt-6 bg-[#0D0D0D]">
                
                {/* Apply Voucher input */}
                <form onSubmit={handleApplyVoucher} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 font-body">
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-2" htmlFor="promo-input">
                    Secret Promo Voucher Code
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      id="promo-input"
                      placeholder="e.g. MAXCHEF20"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none uppercase focus:border-brand-gold"
                    />
                    <button 
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-brand-gold hover:text-black text-brand-gold text-xs font-bold uppercase transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {voucherApplied && (
                    <span className="block text-[10px] text-green-400 font-semibold mt-1">
                      ✓ Promo MAXCHEF20 applied! 20% off active.
                    </span>
                  )}
                </form>

                {/* Math values */}
                <div className="space-y-2 font-body text-xs text-white/60">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white font-bold tabular-nums">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  {voucherApplied && (
                    <div className="flex justify-between text-green-400">
                      <span>Voucher Discount (20%)</span>
                      <span className="tabular-nums">- Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST Culinary Tax (13%)</span>
                    <span className="text-white font-bold tabular-nums">Rs. {taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-brand-gold text-base font-bold pt-2 border-t border-white/5">
                    <span>Estimated Total</span>
                    <span className="tabular-nums">Rs. {totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Trigger Buttons */}
                <div className="space-y-2.5 pt-4">
                  <button 
                    onClick={() => {
                      setCartOpen(false);
                      document.getElementById('whatsapp-builder')?.scrollIntoView({ behavior: 'smooth' });
                      triggerToast('Billing profile loaded below. Verify and hit dispatch!', <Info className="w-5 h-5 text-brand-gold" />);
                    }}
                    className="w-full py-4 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(225,6,0,0.3)] transition-colors cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Proceed To Dispatch Profile</span>
                  </button>
                  <button 
                    onClick={triggerWhatsAppDispatch}
                    className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-brand-gold hover:text-black text-brand-gold font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all border border-white/10 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>1-Tap WhatsApp Checkout</span>
                  </button>
                </div>

              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ==================== GLOBAL LIGHTBOX GRAPHIC MODAL ==================== */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div 
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative max-w-3xl w-full bg-[#121212] border border-white/10 rounded-2xl overflow-hidden p-4 md:p-6 cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/55 text-white/70 hover:text-white hover:bg-black/85 transition-colors cursor-pointer"
                aria-label="Close lightbox"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="aspect-video w-full rounded-xl overflow-hidden">
                <img 
                  src={lightboxImage.src} 
                  alt={lightboxImage.alt} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-6 space-y-2">
                <span className="font-body text-[10px] font-bold text-brand-gold uppercase tracking-wider block">
                  ★ PIZZA MAX WOODFIRED DIARY
                </span>
                <h3 className="font-display text-2xl font-bold text-white">
                  {lightboxImage.alt}
                </h3>
                <p className="font-body text-sm text-white/70 leading-relaxed">
                  {lightboxImage.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== TOAST COMPONENT ==================== */}
      <div 
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 flex items-center gap-3 px-5 py-3 rounded-full bg-[#161616] border border-white/10 shadow-2xl ${
          toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {toast.icon || <Sparkles className="w-5 h-5 text-brand-gold animate-pulse" />}
        <span className="font-body text-xs font-bold tracking-wider text-white uppercase">
          {toast.message}
        </span>
      </div>

    </div>
  );
}
