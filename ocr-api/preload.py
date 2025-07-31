from paddleocr import PaddleOCR

print("Preloading PaddleOCR models...")

ocr = PaddleOCR(
    use_doc_orientation_classify=False,
    use_doc_unwarping=False,
    use_textline_orientation=False,
    det_db_box_thresh=0.6,
    det_db_unclip_ratio=1
)

print("Model loaded successfully!")
