from fastapi import FastAPI, UploadFile, File
from paddleocr import PaddleOCR
import os
import json
import cv2

app = FastAPI()



def get_center_y(box): return sum([pt[1] for pt in box]) / len(box)
def get_center_x(box): return sum([pt[0] for pt in box]) / len(box)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/ocr/")
async def ocr_endpoint(file: UploadFile = File(...), box_thresh: float = 0.6, unclip_ratio: float = 1, 
                       convert_to_gray: bool = True):
    # Save uploaded image temporarily

    ocr = PaddleOCR(
        use_doc_orientation_classify=False,
        use_doc_unwarping=False,
        use_textline_orientation=False,
        det_db_box_thresh=box_thresh,
        det_db_unclip_ratio=unclip_ratio
    )
    folder = "tmp/"
    os.makedirs(folder, exist_ok=True)
    image_path = os.path.join(folder, file.filename)
    output_json_path = image_path.split('.')[0]+'_res.json'

    with open(image_path, "wb") as f:
        content = await file.read()
        f.write(content)

    if convert_to_gray:
        img = cv2.imread(image_path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, binary = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        inverted_binary = cv2.bitwise_not(binary)
        cv2.imwrite(image_path, inverted_binary)

    # Run OCR
    result = ocr.predict(image_path)[0]
    result.save_to_json(folder)

    with open(output_json_path) as f:
        ocr_data = json.load(f)

    # Parse data
    texts = ocr_data['rec_texts']
    scores = ocr_data['rec_scores']
    boxes = ocr_data['rec_polys']  # Or use rec_boxes

    structured = []
    for text, score, box in zip(texts, scores, boxes):
        structured.append({
            "text": text,
            "confidence": round(score, 4),
            "box": box,
        })

    # Group rows by Y
    Y_THRESHOLD = 10
    rows = []

    for item in sorted(structured, key=lambda x: get_center_y(x['box'])):
        y_center = get_center_y(item['box'])
        added = False

        for row in rows:
            if abs(get_center_y(row[0]['box']) - y_center) < Y_THRESHOLD:
                row.append(item)
                added = True
                break

        if not added:
            rows.append([item])

    # Sort each row left to right
    for row in rows:
        row.sort(key=lambda x: get_center_x(x['box']))

    # Build table string
    structured_rows = [[x['text'] for x in row] for row in rows]
    table_string = "\n".join([" | ".join(row) for row in structured_rows])

    return {"table": table_string}
