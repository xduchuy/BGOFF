import sys
import os
from rembg import remove
from PIL import Image

def main():
    input_path = r"c:\Users\Admin\OneDrive\Pictures\xóa phông\3D07CD6B-30C1-4B8E-9C49-08C5817E89D3.jpeg"
    output_path = r"c:\Users\Admin\OneDrive\Pictures\xóa phông\3D07CD6B-30C1-4B8E-9C49-08C5817E89D3_output.png"
    
    if not os.path.exists(input_path):
        print(f"Error: Input file does not exist at {input_path}")
        sys.exit(1)
        
    print(f"Removing background from {input_path}...")
    try:
        # Load image
        input_image = Image.open(input_path)
        
        # Remove background (rembg uses U2Net model automatically)
        output_image = remove(input_image)
        
        # Save output image
        output_image.save(output_path, "PNG")
        print(f"Successfully saved background-removed image to {output_path}")
        
    except Exception as e:
        print(f"Error occurred during background removal: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
