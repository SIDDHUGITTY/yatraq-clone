
2echo "🌍 Fetching public IP..."
export PUBLIC_IP=$(curl -s ifconfig.me)
echo "✅ Using PUBLIC_IP=$PUBLIC_IP"

# Start docker compose
docker compose up --build -d
 
 