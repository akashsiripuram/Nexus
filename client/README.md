# Nexus - Cloud-Based Task Manager

A modern, responsive task management application built with React, featuring a beautiful dark/light theme system and intuitive user interface.

## ✨ Features

### 🎨 **Theme System**
- **Dark/Light Mode**: Seamless switching between themes
- **System Preference Detection**: Automatically detects user's system theme
- **Persistent Storage**: Remembers user's theme choice
- **Smooth Transitions**: Elegant theme switching animations

### 🚀 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Glass Morphism**: Modern design elements with backdrop blur effects
- **Gradient Accents**: Beautiful color schemes and visual hierarchy
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Custom Icons**: Lucide React icons for consistent visual language

### 📱 **Responsive & Mobile-First**
- **Mobile Sidebar**: Collapsible navigation for mobile devices
- **Adaptive Layouts**: Flexible grid systems that work on all screen sizes
- **Touch-Friendly**: Optimized for touch interactions
- **Breakpoint System**: Tailwind CSS responsive utilities

### 🔧 **Core Functionality**
- **Task Management**: Create, edit, and organize tasks
- **User Authentication**: Secure login and registration system
- **Dashboard Analytics**: Visual statistics and progress tracking
- **Team Collaboration**: User management and role-based access
- **Real-time Updates**: Live data synchronization

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.2.0
- **Build Tool**: Vite 5.1.0
- **Styling**: Tailwind CSS 3.4.1
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM 6.22.0
- **HTTP Client**: Axios 1.6.8
- **Icons**: Lucide React 5.0.1
- **Forms**: React Hook Form 7.50.1
- **Notifications**: Sonner 1.4.0
- **Charts**: Recharts 2.12.0

## 🎯 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nexus/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the client directory:
   ```env
   VITE_APP_BACKEND_URL=http://localhost:5000
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## 🎨 Design System

### Color Palette
- **Primary**: Blue shades (#3B82F6 to #1E3A8A)
- **Secondary**: Gray shades (#F8FAFC to #0F172A)
- **Accent**: Purple shades (#D946EF to #701A75)
- **Success**: Green (#10B981)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Primary Font**: Inter (Modern, readable)
- **Display Font**: Poppins (Headings, emphasis)
- **Fallback**: System fonts

### Components
- **Cards**: Rounded corners, shadows, hover effects
- **Buttons**: Gradient backgrounds, hover animations
- **Inputs**: Focus states, validation styling
- **Tables**: Clean borders, hover states

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

## 🌙 Theme System

### Light Mode
- Clean, minimal design
- High contrast for readability
- Subtle shadows and borders
- Professional appearance

### Dark Mode
- Reduced eye strain
- Modern aesthetic
- Consistent color scheme
- Accessibility compliant

### Theme Switching
- **Manual Toggle**: Click theme button in navbar
- **System Detection**: Automatically follows OS preference
- **Local Storage**: Remembers user choice
- **Smooth Transitions**: 300ms color transitions

## 🚀 Performance Features

- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Component lazy loading
- **Optimized Images**: WebP format support
- **Minimal Bundle**: Tree shaking and optimization
- **Fast Refresh**: Vite HMR for development

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Built-in security measures

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🌟 Key Components

### Theme Context
- Global theme state management
- System preference detection
- Local storage persistence
- Smooth theme transitions

### Responsive Navigation
- Collapsible sidebar
- Mobile-first design
- Touch-friendly interactions
- Adaptive layouts

### Form Components
- Validation support
- Error handling
- Accessibility features
- Consistent styling

## 🔧 Customization

### Adding New Themes
1. Extend the color palette in `tailwind.config.js`
2. Add theme variables to CSS
3. Update component classes
4. Test across all breakpoints

### Modifying Components
- Use Tailwind utility classes
- Follow component patterns
- Maintain accessibility
- Test responsiveness

## 📚 API Integration

The application integrates with a Node.js backend API:

- **Authentication**: `/api/user/login`, `/api/user/register`
- **Tasks**: `/api/task/` (CRUD operations)
- **Users**: `/api/user/` (User management)

## 🚀 Future Enhancements

- [ ] **Advanced Analytics**: Charts and reporting
- [ ] **Real-time Collaboration**: Live updates and chat
- [ ] **File Management**: Document and media handling
- [ ] **Mobile App**: React Native version
- [ ] **Offline Support**: Service worker implementation
- [ ] **Multi-language**: Internationalization support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**Built with ❤️ using React, Tailwind CSS, and modern web technologies**
