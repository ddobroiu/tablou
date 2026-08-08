import cloudinary
import cloudinary.api
from dotenv import load_dotenv
import os

load_dotenv('.env.local')

def main():
    cloudinary.config(
        cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
        api_key=os.getenv('CLOUDINARY_API_KEY'),
        api_secret=os.getenv('CLOUDINARY_API_SECRET'),
        secure=True
    )
    
    FOLDER = 'prynt/canvas'
    print(f"🗑️  Starting cleanup for folder: {FOLDER}")
    
    try:
        # Delete all resources in the folder
        res = cloudinary.api.delete_resources_by_prefix(FOLDER)
        print(f"✅ Deleted files: {res.get('deleted', {})}")
        
        # Try to delete the folder itself (only works if empty)
        # Cloudinary often auto-removes empty folders, but we can try
        try:
           cloudinary.api.delete_folder(FOLDER)
           print("✅ Deleted folder.")
        except Exception as e:
           print(f"ℹ️  Folder delete info (might be non-empty or auto-deleted): {e}")
           
    except Exception as e:
        print(f"❌ Error during cleanup: {e}")

if __name__ == "__main__":
    main()
