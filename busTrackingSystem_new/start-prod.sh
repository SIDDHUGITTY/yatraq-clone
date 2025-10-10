
set -e

echo "⏳ Waiting for database..."
until nc -z "$db_Host" "$db_port"; do 
  sleep 2
done

echo "✅ Database is ready!"
echo "🚀 Applying migrations..."

npx drizzle-kit push

echo "✅ Migrations applied, starting app..."
exec node dist/src/main.js
