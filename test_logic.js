const MAIN_DATA = [
  { id: 1, name: "A", ans: [5, 1, 4, 2, 5] },
  { id: 2, name: "B", ans: [2, 5, 1, 3, 4] },
  { id: 3, name: "C", ans: [4, 2, 5, 1, 2] },
  { id: 4, name: "D", ans: [5, 4, 3, 5, 1] },
  { id: 5, name: "E", ans: [1, 3, 5, 4, 2] },
  { id: 6, name: "F", ans: [3, 2, 4, 5, 5] },
  { id: 7, name: "G", ans: [5, 5, 1, 2, 3] },
  { id: 8, name: "H", ans: [4, 4, 4, 4, 4] },
  { id: 9, name: "I", ans: [2, 1, 2, 5, 4] },
  { id: 10, name: "J", ans: [3, 5, 3, 1, 5] }
]

const calculateSimilarity = (resp) => {
  const scores = MAIN_DATA.map(item => {
    const distance = Math.sqrt(
      item.ans.reduce((sum, val, idx) => sum + Math.pow(resp[idx] - val, 2), 0)
    )
    return { ...item, distance }
  })
  return scores.sort((a, b) => a.distance - b.distance)
}

const testResponse = [3, 4, 2, 5, 1]
const results = calculateSimilarity(testResponse)
console.log(JSON.stringify(results, null, 2))
