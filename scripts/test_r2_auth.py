import boto3
import os
from botocore.exceptions import ClientError
from dotenv import load_dotenv

load_dotenv('.env.local')

ACCOUNT_ID = os.getenv('R2_ACCOUNT_ID')
ACCESS_KEY = os.getenv('R2_ACCESS_KEY_ID')
SECRET_KEY = os.getenv('R2_SECRET_ACCESS_KEY')
ENDPOINT_URL = f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com"

def main():
    print(f"📡 Connecting to R2 Endpoint: {ENDPOINT_URL}")
    s3 = boto3.client(
        's3',
        endpoint_url=ENDPOINT_URL,
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY
    )
    
    BUCKET_NAME = 'prynt-assets'
    try:
        print(f"🔍 Attempting to upload to '{BUCKET_NAME}'...")
        s3.put_object(Bucket=BUCKET_NAME, Key='verify-auth.txt', Body=b'Access Verified')
        print("✅ Success! Write access confirmed.")
    except ClientError as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    main()
