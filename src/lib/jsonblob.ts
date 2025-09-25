const API_URL = "https://jsonblob.com/api/jsonBlob";

export async function createJsonBlob(data: any): Promise<Response> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to create JSONBlob');
  }

  return response;
}

export async function getJsonBlob(id: string): Promise<any> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to get JSONBlob with status: ${response.status}`);
    }

    return response.json();
}

export async function updateJsonBlob(id: string, data: any): Promise<any> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to update JSONBlob');
    }

    return response.json();
}
