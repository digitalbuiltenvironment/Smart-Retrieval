import json
import os

import requests
from bs4 import BeautifulSoup
from doc2docx import convert as convert_doc2docx

"""
A web scraping script to download the Public Sector Standard Conditions of Contract (PSSCOC) documents from the BCA website.
The script will create a folder for each category and download the documents into the respective category folder.
The script will also convert doc files to docx files.
The script will also get the About PSSCOC page info and saves to a json file.
"""

# Website URL
base_url = "https://www1.bca.gov.sg"
docs_endpoint = "/procurement/post-tender-stage/public-sector-standard-conditions-of-contract-psscoc"

# Source Documents Folder
source_doc_dir = "data"
# PSSCOC Page Info Folder
psscoc_page_info_dir = "About PSSCOC"


# Get the PSSCOC documents
def get_psscoc_docs():
    """
    Downloads the PSSCOC documents.
    """
    # Send a GET request to the website URL
    response = requests.get(base_url + docs_endpoint, timeout=10)
    response.raise_for_status()  # Check for HTTP errors

    # Parse the HTML content of the response
    soup = BeautifulSoup(response.content, "html.parser")

    # Find the table element that contains the  Conditions of Contract & Downloads link
    table = soup.find("table")

    # Loop through each row of the table element, skipping the first row
    for row in table.find_all("tr")[1:]:
        # Find the first cell of the row that contains the category name
        first_cell = row.find("td", attrs={"scope": "row"})
        category_name = first_cell.find("strong").text.strip()
        print("Category:", category_name)

        # Create a folder for each category if it doesn't exist
        category_folder = os.path.join(source_doc_dir, category_name)
        if not os.path.exists(category_folder):
            os.makedirs(category_folder)

        # Find the second cell of the row that contains the href links
        second_cell = row.find("ol")
        # Loop through each list item in the second cell
        for li in second_cell.find_all("li"):
            # Find the href link
            href_link = li.find("a")["href"]
            # if starts with /docs, then it is a relative link
            if href_link.startswith("/docs"):
                href_link = base_url + href_link

            # Get the filename from the href link
            filename = os.path.basename(href_link).split("?")[0]
            print("Downloading:", filename)
            # Send a GET request to the href link
            response = requests.get(href_link, timeout=10)
            # Write the response content to a file
            with open(os.path.join(category_folder, filename), "wb") as f:
                f.write(response.content)
                print("Saved to:", os.path.join(category_folder, filename))
            # convert doc to docx
            if filename.endswith(".doc"):
                print("Converting to docx...")
                convert_doc2docx(os.path.join(category_folder, filename))
                print(
                    "Converted to:",
                    os.path.join(category_folder, filename + "x"),
                )
                # remove the original doc file
                os.remove(os.path.join(category_folder, filename))
        # line break
        print("-" * 100)


def get_psscoc_page_info():
    """
    Get the About PSSCOC page info and saves to a json file.
    """
    print("Getting PSSCOC Page Info...")
    # Send a GET request to the website URL
    response = requests.get(base_url + docs_endpoint, timeout=10)
    response.raise_for_status()  # Check for HTTP errors

    # Parse the HTML content of the response
    soup = BeautifulSoup(response.content, "html.parser")

    # Extract the necessary HTML elements
    mid_body = soup.find("div", attrs={"class": "mid"})

    cleaned_results = {}

    # Extract title from the mid_body
    title = mid_body.find("div", attrs={"class": "title"}).text.strip()
    cleaned_results["Title"] = title

    # Extract the flow content from the mid_body
    flow_content = mid_body.find("ul", attrs={"class": "rsmFlow rsmLevel rsmOneLevel"})
    flow = [li.text.strip() for li in flow_content.find_all("li")]
    cleaned_results["Stage of PSSCOC"] = " > ".join(flow[1:])

    # Extract sfContentBlock from the mid_body
    sf_content_block = mid_body.find("div", attrs={"class": "sfContentBlock"})

    # Extract all the paragraphs from the sfContentBlock but not nested paragraphs
    paragraphs = sf_content_block.find_all("p", recursive=False)
    paragraphs_text = [p.text.strip() for p in paragraphs]
    cleaned_results["About"] = paragraphs_text[0]
    more_about = {}
    more_about[paragraphs_text[1]] = (
        paragraphs_text[2]
        .replace("\n", " ")
        .replace("\r", " ")
        .replace("\u00a0", " ")
        .strip()
    )

    # Extract ul from the sfContentBlock
    ul_content = sf_content_block.find("ul")
    ul_li = [li.text.strip() for li in ul_content.find_all("li")]
    more_about[paragraphs_text[3]] = ul_li  # title for 3rd paragraph

    cleaned_results["More About"] = more_about

    # Extract the table from the sfContentBlock
    table = sf_content_block.find("table")
    table_rows = table.find_all("tr")
    header_row = [td.text.strip() for td in table_rows[0].find_all("td")]
    header_row = ["Category Name", "Category File Names"]
    table_data_list = []
    for row in table_rows[1:]:
        row_data = [td.text.strip() for td in row.find_all("td")]
        row_data[-1] = row_data[-1].split("\n")
        # remove empty string
        row_data[-1] = [x.strip() for x in row_data[-1] if x]
        table_data = dict(zip(header_row, row_data))
        table_data_list.append(table_data)
    cleaned_results["Categories of PSSCOC"] = table_data_list

    # Extract all the divs from the sfContentBlock but not nested divs
    # divs = sf_content_block.find_all("div", recursive=False)

    # Save the json results content to a file
    page_info_folder = os.path.join(source_doc_dir, psscoc_page_info_dir)
    file_name = "About PSSCOC.json"
    # Create a folder for page info if it doesn't exist
    if not os.path.exists(page_info_folder):
        os.makedirs(page_info_folder)
    # Save the results content to a file
    with open(os.path.join(page_info_folder, file_name), "wb") as f:
        f.write(json.dumps(cleaned_results, indent=4).encode("utf-8"))
        print(
            "Saved to:",
            os.path.join(page_info_folder, file_name),
        )


# Main function
def main():
    """
    Main function.
    """
    try:
        # Get the PSSCOC documents
        get_psscoc_docs()
        # Get the About PSSCOC page info
        get_psscoc_page_info()
    except requests.exceptions.RequestException as e:
        print("Error: Failed to make a request to the website.")
        print(e)
    except Exception as e:
        print("An unexpected error occurred:")
        print(e)


if __name__ == "__main__":
    main()
