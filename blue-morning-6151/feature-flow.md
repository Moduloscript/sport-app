# Feature Flow Diagram

```mermaid
flowchart TD
    A[User]:::user --> B[Landing Page]:::page
    B --> C{Logged In?}:::decision
    C -->|Yes| D[Main Dashboard]:::dashboard
    C -->|No| E[Login/Signup]:::auth
    D --> F[Football News]:::feature
    D --> G[Match Predictions]:::feature
    D --> H[Other Sports]:::feature
    F --> I[View Articles]:::action
    G --> J[Make Prediction]:::action
    H --> K[Browse Sports]:::action
    
    classDef user fill:#4CAF50,color:white
    classDef page fill:#2196F3,color:white
    classDef decision fill:#FFC107,color:black
    classDef dashboard fill:#9C27B0,color:white
    classDef auth fill:#F44336,color:white
    classDef feature fill:#00BCD4,color:black
    classDef action fill:#8BC34A,color:black
