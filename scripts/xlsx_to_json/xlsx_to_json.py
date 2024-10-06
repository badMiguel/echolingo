import pandas as pd
import sys


def xlsx_to_json(xlsx_file, json_file):
    # Read the Excel file
    df = pd.read_excel(xlsx_file)

    # Convert the DataFrame to JSON
    json_data = df.to_json(orient="records", lines=True)

    # Write JSON data to a file
    if json_data:
        with open(json_file, "w") as f:
            f.write(json_data)

    print(f"Converted {xlsx_file} to {json_file}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python xlsx_to_json.py <input_file.xlsx> <output_file.json>")
    else:
        xlsx_file = sys.argv[1]
        json_file = sys.argv[2]
        xlsx_to_json(xlsx_file, json_file)
