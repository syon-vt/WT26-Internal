import math
main = [
  { "id": 1, "name": "A", "ans": [5, 1, 4, 2, 5] },
  { "id": 2, "name": "B", "ans": [2, 5, 1, 3, 4] },
  { "id": 3, "name": "C", "ans": [4, 2, 5, 1, 2] },
  { "id": 4, "name": "D", "ans": [5, 4, 3, 5, 1] },
  { "id": 5, "name": "E", "ans": [1, 3, 5, 4, 2] },
  { "id": 6, "name": "F", "ans": [3, 2, 4, 5, 5] },
  { "id": 7, "name": "G", "ans": [5, 5, 1, 2, 3] },
  { "id": 8, "name": "H", "ans": [4, 4, 4, 4, 4] },
  { "id": 9, "name": "I", "ans": [2, 1, 2, 5, 4] },
  { "id": 10, "name": "J", "ans": [3, 5, 3, 1, 5] }
]

r = [3, 4, 2, 5, 1]

def calculate_similarity(resp):
    similarity_scores = []
    for i in range(len(main)):
        point = main[i]["ans"]
        distance = math.sqrt(sum((r[j] - point[j]) ** 2 for j in range(len(r))))
        similarity_scores.append({
            "id": main[i]["id"],
            "name": main[i]["name"],
            "distance": distance
        })
        print(similarity_scores)
    return sorted(similarity_scores, key=lambda x: x["distance"])

print(calculate_similarity(r))