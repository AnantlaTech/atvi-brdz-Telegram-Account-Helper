<img width="123" height="106" alt="BRDZ Shpper" src="https://github.com/user-attachments/assets/c4d27fe3-dd50-45ea-aa84-124e2a322a42" />

# BRDZ Telegram Account Helper

A comprehensive web application for managing BRDZ Assistant Telegram bot accounts with integrated eKYC verification, wallet management, and MCP (Model Context Protocol) support.

## Features

### Core Features
- **User Authentication & Profile Management**
- **eKYC Verification** via Sumsub integration
- **Telegram Bot Credentials Management**
- **Multi-language Support** (English/Indonesian)
- **Responsive Dashboard UI**

### Planned Features
- **Custodial Wallet Management** (NEON network)
- **USDC Balance & Transaction History**
- **MCP Integration** for e-commerce purchases
- **Order Management System**

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Hooks** - Custom SDK hook for API management

### Backend Integration
- **RESTful APIs** for authentication and data management
- **Sumsub SDK** for identity verification
- **Blockchain Integration** (Neon EVM network)

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Git** - Version control

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard page
│   ├── ekyc/              # eKYC verification page
│   ├── login/             # Authentication page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── dashboard/         # Dashboard-specific components
│   ├── ekyc/             # eKYC form components
│   └── ui/               # Generic UI components
├── contexts/             # React Context providers
├── hooks/               # Custom React hooks
│   └── useSDK.ts        # Main SDK hook
├── lib/                # Utility libraries
├── types/              # TypeScript type definitions
└── public/            # Static assets
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnantlaTech/atvi-brdz-Telegram-Account-Helper.git
   cd atvi-brdz-Telegram-Account-Helper
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_API_BASE_URL=your_backend_api_url
   NEXT_PUBLIC_SUMSUB_APP_TOKEN=your_sumsub_token
   # Add other environment variables as needed
   ```

4. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### User Registration & Authentication
1. Access `/login` page
2. Register new account or login with existing credentials
3. Complete profile setup

### eKYC Verification
1. Navigate to `/ekyc` after registration
2. Complete identity verification via Sumsub
3. Wait for approval status
4. Access full dashboard features after approval

### Dashboard Management
1. View profile information
2. Manage eKYC status
3. Access Telegram bot credentials (post-verification)
4. Monitor account status

## API Integration

### Authentication Endpoints
- `POST /auth/login` - User authentication
- `POST /auth/register` - New user registration
- `GET /auth/profile` - Get user profile

### eKYC Endpoints
- `POST /ekyc/generate-token` - Generate Sumsub token
- `POST /ekyc/sync-status` - Sync verification status

### Wallet Management (Planned)
- `POST /wallet/create` - Create new wallet
- `GET /wallet/balance` - Get USDC balance
- `GET /wallet/history` - Transaction history

## Development Guidelines

### Code Style
- Follow TypeScript strict mode
- Use functional components with hooks
- Implement proper error handling
- Add loading states for async operations

### Component Structure
- Keep components small and focused
- Use proper TypeScript interfaces
- Implement proper error boundaries
- Follow React best practices

### State Management
- Use React Context for global state
- Custom hooks for API interactions
- LocalStorage for persistence when appropriate

## Bot Integration Flow

### How It Works with @BRDZ_shop_bot

1. **User Profile Creation**
   - Users create profiles via this web app
   - Complete eKYC verification for compliance
   - Generate USDC wallet for transactions

2. **Telegram Bot Connection**  
   - Users connect their verified profile to @BRDZ_shop_bot
   - Bot validates user credentials and eKYC status
   - Enables full shopping features in Telegram

3. **Shopping Experience**
   - Users chat with @BRDZ_shop_bot: "Buy https://tokopedia.com/..."
   - Bot processes orders using user's verified profile
   - USDC payments handled automatically via user's wallet
   - Order fulfillment and tracking through bot interface

4. **Transaction Flow**
   - Bot accesses user's USDC wallet (custodial)
   - Executes blockchain transactions for purchases
   - Provides real-time transaction updates
   - Maintains purchase history and receipts

### Security & Compliance
- **KYC Compliance** - All users verified via Sumsub
- **Custodial Wallet System** - Secure key management  
- **Transaction Monitoring** - All purchases tracked and logged
- **Bot Authentication** - Secure connection between profile and bot

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Ensure all production environment variables are properly configured:
- API endpoints
- Third-party service tokens
- Security configurations

## Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with proper testing
3. Update documentation if needed
4. Submit pull request for review

### Code Quality
- Run ESLint before commits
- Follow established patterns
- Add proper TypeScript types
- Include error handling

## Support & Documentation

### Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Guide](https://tailwindcss.com/docs)
- [Sumsub Integration Guide](https://developers.sumsub.com/)

### Issues & Support
- Report issues via GitHub Issues
- Check existing documentation first
- Provide detailed reproduction steps

## License

This project is proprietary software developed by **Anantla Technology**. Internal use only.

**Copyright © 2024 Anantla Technology. All rights reserved.**

- Website: [https://www.anantla.org](https://www.anantla.org)
- Contact: [https://www.anantla.org/contact](https://www.anantla.org/contact)

## Version History

### v1.0.0 (Current)
- Initial release with core authentication
- eKYC verification integration
- Basic dashboard functionality
- Telegram credentials management

### Planned Updates
- v1.1.0: Wallet management integration
- v1.2.0: MCP e-commerce features
- v1.3.0: Enhanced transaction history

---

**Note**: This is an active development project. Features and documentation are continuously updated.
