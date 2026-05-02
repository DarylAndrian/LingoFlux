#!/bin/bash

# Change to script directory
cd "$(dirname "$0")"

echo "🔗 Applying LingoFlux Database Schema to Supabase..."

SUPABASE_URL="https://cgpmvpjwgormgkvrzsoc.supabase.co"
JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNncG12cGp3Z29ybWdrdnJ6c29jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTc3MzA1OCwiZXhwIjoyMDkyODgxNTA4fQ.zc0BHuKCXSU7DZdydA__315EGLGG7TBom3lcfN8kzPg"

SQL_FILE="./supabase/migrations/001_initial_schema.sql"

if [ ! -f "$SQL_FILE" ]; then
  echo "❌ SQL file not found: $SQL_FILE"
  exit 1
fi

echo "📖 Reading SQL file..."
SQL=$(cat "$SQL_FILE")

echo "🚀 Executing SQL via Supabase API..."

# Try using Supabase SQL API
response=$(curl -s -X POST "${SUPABASE_URL}/rest/v1/rpc/exec_sql_internal" \
  -H "apikey: $JWT_TOKEN" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"sql\": $(echo "$SQL" | jq -Rs .)}" 2>&1)

echo "Response: $response"

if echo "$response" | grep -q '"success":true\|"data"\|"rows"'; then
  echo "✅ Schema applied successfully!"
else
  echo "⚠️  Direct SQL execution failed."
  echo ""
  echo "📝 Please apply the schema manually:"
  echo ""
  echo "1. Open this URL in your browser:"
  echo "   https://console.supabase.com/project/cgpmvpjwgormgkvrzsoc/sql"
  echo ""
  echo "2. Create a new query"
  echo ""
  echo "3. Copy the entire contents of this file:"
  echo "   $SQL_FILE"
  echo ""
  echo "4. Paste into the SQL Editor and click 'Run'"
  echo ""
  echo "5. After running, verify with:"
  echo "   node test-connection.js"
  echo ""
  exit 1
fi
