# Monotonic vs Wall-Clock Timing (Tier 1)

## When to Use
- **Performance Monitoring**: Measuring API response times, database query duration.
- **Timeouts**: Implementing a 5-second wait before retrying a connection.
- **Job Scheduling**: Running a task every 60 seconds.

## The Pattern
Always use a **Monotonic Clock** for measuring time intervals and durations. Only use **Wall-Clock (Time-of-Day)** for displaying the current time to the user.

### Implementation Logic
**BAD (Wall-Clock):**
```python
start = time.time() # 1696156800.00
do_work()
# If NTP synchronizes here and jumps the clock back 1 second...
end = time.time() # 1696156799.99
duration = end - start # -0.01 seconds! (Crashes your logic)
```

**GOOD (Monotonic):**
```python
start = time.monotonic() # 12345.67
do_work()
# Even if NTP jumps the wall clock, this keeps moving forward at a constant rate
end = time.monotonic() # 12345.87
duration = end - start # 0.20 seconds (Accurate)
```

## Trade-offs
- **Human Readability**: Monotonic values (like `12345.67`) are meaningless to humans. They are purely for delta calculations.
- **Serialization**: You cannot send a monotonic timestamp from one machine to another. They only make sense on the local machine.

## Failure Modes
- **System Sleep**: On some operating systems, the monotonic clock might stop while the computer is in "Sleep" mode.
- **NTP Slewing**: NTP can speed up or slow down the monotonic clock slightly (to catch up with real time), but it will never jump it.

## Verification
- **Unit Test**: Measure the time of a `sleep(1)` call. Verify that the duration is between 1.0 and 1.1 seconds.
- **Code Review**: Grep for `System.currentTimeMillis()` or `time.time()` and ensure they are only used for logging or DB timestamps, not logic.
