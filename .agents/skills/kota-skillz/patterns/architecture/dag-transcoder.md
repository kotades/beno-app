# DAG Transcoder (Tier 3)

## When to Use
- **Video Platforms**: When you need to process large video files into multiple formats, resolutions, and bitrates (YouTube, Netflix).
- **Complex Data Pipelines**: When tasks have dependencies (e.g., "Watermark" can only happen after "Encoding").

## The Pattern
Model the transcoding process as a **Directed Acyclic Graph (DAG)**. This allows the system to execute independent tasks in parallel and manage complex dependencies.

### Implementation Logic
1. **Preprocessor**: Splits the video into **GOP (Group of Pictures)** chunks. Each chunk is a few seconds of video that can be processed independently.
2. **DAG Scheduler**: Reads a configuration file and breaks the DAG into stages. Stage 1 tasks (e.g., extracting audio) must complete before Stage 2.
3. **Resource Manager**: Maintains three queues:
   - **Task Queue**: Priority-ordered tasks (e.g., "720p Encoding" might be higher priority than "Thumbnail Generation").
   - **Worker Queue**: List of available workers and their capabilities (GPU vs CPU).
   - **Running Queue**: Tracks active tasks for failure recovery.
4. **Task Workers**: Pull tasks and execute specific logic (e.g., `ffmpeg` for transcoding).

## Trade-offs
- **Complexity**: Building a DAG engine is a significant engineering effort.
- **Latency**: The overhead of splitting and scheduling can add delay to very short videos.

## Failure Modes
- **Worker Crash**: If a worker dies mid-task, the Resource Manager must detect it via a timeout and re-queue the task.
- **Malformed Input**: If the source video is corrupted, the "Inspection" task should fail fast and stop the entire DAG.

## Verification
- **Parallelism Test**: Transcode a 10-minute video. Verify that CPU/GPU utilization is high across multiple workers.
- **Resumability Test**: Kill the process halfway. Verify that the system resumes from the last completed GOP chunk, not from the beginning.
