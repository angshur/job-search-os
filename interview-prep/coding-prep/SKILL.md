---
name: interview-prep/coding-prep
description: >
  Coding interview preparation for Forward Deployed Engineer (FDE) roles.
  Covers the 6 core pattern areas, drill structure, Python fluency reminders,
  and FDE-specific context. Load this when drilling coding problems or
  preparing for technical coding rounds at Palantir, Anduril, Scale AI,
  or similar FDE-targeting companies.
---

# Coding Prep — FDE Interview Preparation

## FDE CODING INTERVIEW CONTEXT

FDE roles (Palantir, Anduril, Scale AI, etc.) test coding differently
than pure SWE roles:

- LeetCode Medium is the baseline bar. Must be fluent and fast.
- LeetCode Hard appears occasionally at Palantir specifically.
- System design is weighted more heavily than pure coding vs SWE roles.
- Customer problem-solving rounds exist — no coding, pure judgment.
- SQL and data manipulation questions are common for FDE specifically.
- Communication while coding is evaluated — think out loud.

Target: solve a LeetCode medium in under 20 minutes in Python,
while explaining your approach out loud.

---

## THE 6 CORE PATTERN AREAS

These map directly to the coding-patterns category in content.json.
Master these 6. Everything else is a variant.

---

### Pattern 1 — Arrays & Sliding Window

**When to use:** subarray problems, running window of fixed or variable size,
"find X in a contiguous sequence"

**Template:**
```python
def sliding_window(arr, k):
    left = 0
    window_sum = 0
    result = 0
    for right in range(len(arr)):
        window_sum += arr[right]          # expand window
        if right - left + 1 > k:         # window too large
            window_sum -= arr[left]       # shrink from left
            left += 1
        result = max(result, window_sum)  # update result
    return result
```

**Key problems to drill:**
- Maximum subarray (Kadane's algorithm — different pattern, know both)
- Longest substring without repeating characters
- Minimum window substring
- Sliding window maximum

**The PM angle:** sliding window is how you think about moving averages
in analytics — same mental model, different implementation.

---

### Pattern 2 — Two Pointers

**When to use:** sorted array problems, pair-finding, partition problems

**Template:**
```python
def two_pointers(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        current = arr[left] + arr[right]
        if current == target:
            return [left, right]
        elif current < target:
            left += 1
        else:
            right -= 1
    return []
```

**Key problems to drill:**
- Two sum (sorted array variant)
- Container with most water
- 3Sum
- Trapping rain water (harder — know it)

---

### Pattern 3 — BFS / DFS

**When to use:** trees, graphs, shortest path, connected components,
level-order traversal

**BFS template (iterative — use for shortest path):**
```python
from collections import deque
def bfs(graph, start):
    queue = deque([start])
    visited = {start}
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```

**DFS template (recursive — use for path finding, backtracking):**
```python
def dfs(node, visited):
    if node in visited:
        return
    visited.add(node)
    for neighbor in graph[node]:
        dfs(neighbor, visited)
```

**Key problems to drill:**
- Number of islands
- Clone graph
- Binary tree level order traversal
- Word ladder (BFS shortest path)
- Course schedule (topological sort / cycle detection)

---

### Pattern 4 — Binary Search

**When to use:** sorted array, "find minimum X that satisfies condition,"
monotonic search space

**Standard template:**
```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```

**Binary search on answer template:**
```python
def binary_search_answer(lo, hi, condition):
    while lo < hi:
        mid = (lo + hi) // 2
        if condition(mid):
            hi = mid        # answer is mid or lower
        else:
            lo = mid + 1    # answer is above mid
    return lo
```

**Key problems to drill:**
- Search in rotated sorted array
- Find minimum in rotated sorted array
- Koko eating bananas (binary search on answer)
- Capacity to ship packages in D days

**Off-by-one reminder:** if left=mid (not mid+1) you can infinite loop
when left+1==right. Safe default: use left<right with one template above.

---

### Pattern 5 — Heap / Priority Queue

**When to use:** top-K, merge K sorted, median maintenance,
"always process the most/least important next"

**Python heap basics:**
```python
import heapq
# Min-heap by default
heap = []
heapq.heappush(heap, val)
min_val = heapq.heappop(heap)
# Max-heap: negate values
heapq.heappush(heap, -val)
max_val = -heapq.heappop(heap)
```

**Top-K pattern:**
```python
def top_k(nums, k):
    # Min-heap of size K
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    return list(heap)
```

**Key problems to drill:**
- Kth largest element in array
- Merge K sorted lists
- Find median from data stream (two heaps)
- K closest points to origin

---

### Pattern 6 — Dynamic Programming

**When to use:** optimization problems, counting problems, overlapping
subproblems, "how many ways," "minimum cost"

**The DP thinking process:**
1. Define state: dp[i] = what does this represent?
2. Find recurrence: how does dp[i] relate to dp[i-1]?
3. Set base case: dp[0] = ?
4. Return: what index/value is the answer?

**1D DP template:**
```python
def dp_1d(nums):
    n = len(nums)
    dp = [0] * (n + 1)
    dp[0] = base_case
    for i in range(1, n + 1):
        dp[i] = recurrence(dp[i-1], nums[i-1])
    return dp[n]
```

**Key problems to drill:**
- Climbing stairs (intro)
- House robber (skip or take)
- Coin change (minimum coins)
- Longest common subsequence
- 0/1 Knapsack

---

## SQL FOR FDE ROLES

FDE interviews frequently include SQL, especially at data-focused companies.

**Must know cold:**
```sql
-- Window functions (most common FDE SQL question)
SELECT
    user_id,
    event_date,
    revenue,
    SUM(revenue) OVER (PARTITION BY user_id ORDER BY event_date) as running_total,
    LAG(revenue, 1) OVER (PARTITION BY user_id ORDER BY event_date) as prev_revenue,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY revenue DESC) as rank
FROM events;

-- Self-join for consecutive events
SELECT a.user_id, a.event_date, b.event_date as next_date
FROM events a
JOIN events b ON a.user_id = b.user_id
    AND b.event_date = a.event_date + INTERVAL '1 day';

-- Finding Nth highest value
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET N-1;
```

**Common FDE SQL patterns:**
- Retention analysis (cohort-based, day N retention)
- Funnel analysis (step-by-step conversion)
- Rolling averages and running totals (window functions)
- Finding duplicates or anomalies
- Top N per group (ROW_NUMBER() pattern)

---

## DRILL STRUCTURE

**If 6+ weeks out:**
Week 1-2: Easy only. 5/day. Timed at 10 minutes. Python fluency.
Week 3-4: Mediums by pattern. 2-3 problems/pattern. One pattern/day.
Week 5-6: Mixed mediums + one hard per session. Think out loud.
Full 35-minute mock sessions.

**If 2-4 weeks out:**
Days 1-3: Review all 6 patterns, one problem per pattern (easy).
Days 4-10: 3 mediums/day, mixed patterns, timed at 20 minutes each.
Days 11-14: Full mock sessions + SQL drills.

**If < 2 weeks out:**
Focus only on sliding window, two pointers, and BFS/DFS.
These three cover 60%+ of medium problems.
Do NOT try to learn DP from scratch in < 2 weeks.

---

## THINKING OUT LOUD — FDE COMMUNICATION PATTERN

FDE interviews evaluate communication as much as coding.
The pattern that works:

1. "Let me make sure I understand the problem..." (restate it)
2. "My first instinct is [approach] because [reason]..."
3. "The edge cases I'm thinking about are [X, Y, Z]..."
4. "Let me start coding and I'll talk through my logic..."
5. While coding: "Here I'm doing X because Y..."
6. After coding: "Let me trace through an example to verify..."
7. "The time complexity is O(?) because... space is O(?) because..."
8. "If I had more time I'd optimize by..."

Never code in silence. The thinking is the interview.

---

## PYTHON FLUENCY REMINDERS

```python
# Common patterns to know without thinking
from collections import defaultdict, Counter, deque
from heapq import heappush, heappop
import bisect  # for sorted insertion

# defaultdict
graph = defaultdict(list)
count = defaultdict(int)

# Counter
freq = Counter(arr)  # {element: count}
freq.most_common(k)  # top K elements

# Enumerate
for i, val in enumerate(arr):
    pass

# Zip
for a, b in zip(arr1, arr2):
    pass

# List comprehension
result = [x*2 for x in arr if x > 0]

# String operations
s.split()           # split on whitespace
''.join(lst)        # join list to string
s[::-1]             # reverse string

# Integer division and mod
q, r = divmod(n, k)
mid = left + (right - left) // 2  # safe mid for binary search
```

---

## PLATFORMS

- LeetCode — primary. Filter by pattern tag, do tagged problems.
- NeetCode.io — best structured curriculum, matches these 6 patterns exactly.
  Roadmap view shows exactly what to do in what order.
- interviewing.io — mock interviews with real engineers for FDE-style sessions.
- SQLZoo / StrataScratch — SQL practice specifically.
