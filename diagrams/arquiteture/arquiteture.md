graph TB
    Client[Client Applications] --> |HTTP Requests| API[Express API]
    API --> |Authentication| Auth[JWT Authentication]
    API --> Routes[Routes Layer]
    Routes --> |Public Routes| PublicController[Public Controllers]
    Routes --> |Protected Routes| ProtectedController[Protected Controllers]
    
    ProtectedController --> |Account Operations| AccountFeature[Account Feature]
    ProtectedController --> |Transaction Operations| TransactionFeature[Transaction Feature]
    ProtectedController --> |Card Operations| CardFeature[Card Feature]
    
    UserFeature --> |Data Access| Repository[(MongoDB Repositories)]
    AccountFeature --> |Data Access| Repository
    CardFeature --> |Data Access| Repository
    
    Repository --> |Schema| Models[Mongoose Models]