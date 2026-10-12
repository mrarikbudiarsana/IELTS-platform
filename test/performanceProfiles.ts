import assert from 'node:assert/strict';
import { startPostgres } from './postgresHarness';

async function main() {
  const pg=await startPostgres();
  try {
    const {db}=await import('../server/db');
    const {seedLocalDatabase}=await import('../server/seedLocalDatabase');
    await seedLocalDatabase();
    const teacher=await db.prepare("SELECT id FROM users WHERE role='admin' LIMIT 1").get();
    const student=await db.prepare("SELECT id FROM users WHERE role='student' LIMIT 1").get();
    for(let i=0;i<10;i++) {
      await db.prepare("INSERT INTO writing_tasks (id,title,task_type,task_number,test_type,status,created_by_id) VALUES (?,?,'task_2',2,'academic','published',?)").run(`perf-task-${i}`,`Performance task ${i}`,teacher.id);
      await db.prepare("INSERT INTO writing_task_versions (id,task_id,version_number,status,task_type,task_number,test_type,title,prompt,instructions,model_response,teacher_assessment_guidance) VALUES (?,?,1,'published','task_2',2,'academic',?,'Describe your view','Write an essay','private model','private guidance')").run(`perf-version-${i}`,`perf-task-${i}`,`Performance task ${i}`);
      await db.prepare("INSERT INTO writing_attempts (id,user_id,mode,task2_id,task2_version_id) VALUES (?,?,'practice',?,?)").run(`perf-attempt-${i}`,student.id,`perf-task-${i}`,`perf-version-${i}`);
      await db.prepare("INSERT INTO writing_responses (id,attempt_id,task_id,task_version_id,task_number,response_text) VALUES (?,?,?,?,2,?)").run(`perf-response-${i}`,`perf-attempt-${i}`,`perf-task-${i}`,`perf-version-${i}`,`Essay ${i}`);
      await db.prepare("INSERT INTO speaking_assessments (id,student_id,teacher_id,session_type,parts_covered_json,session_date,status,teacher_private_notes) VALUES (?,?,?,'partial_practice','[\"part1\"]',?,'released','private teacher notes')").run(`perf-speaking-${i}`,student.id,teacher.id,new Date().toISOString());
    }
    let queries=0;
    const prepare=db.prepare.bind(db);
    db.prepare=sql=>{
      const statement=prepare(sql);
      return {
        get:async(...args:any[])=>{queries++;return statement.get(...args);},
        all:async(...args:any[])=>{queries++;return statement.all(...args);},
        run:async(...args:any[])=>{queries++;return statement.run(...args);},
      };
    };
    async function profile(name:string,work:()=>Promise<any>,limit:number) {
      queries=0;
      const result=await work();
      console.log(JSON.stringify({flow:name,queries,records:Array.isArray(result)?result.length:undefined}));
      if(process.argv.includes('--assert-limits'))assert.ok(queries<=limit,`${name}: ${queries} queries exceeds ${limit}`);
      return result;
    }
    const writing=await import('../server/writingService');
    const speaking=await import('../server/speakingService');
    const tasks=await profile('writing catalogue (10 tasks)',()=>writing.listWritingTasks({userRole:'student'}),2);
    assert.equal(tasks.length,10);
    assert.equal(tasks[0].versions[0].modelResponse,undefined);
    assert.equal(tasks[0].versions[0].teacherAssessmentGuidance,undefined);
    const attempts=await profile('writing history (10 attempts)',()=>writing.listUserWritingAttempts(student.id),3);
    assert.equal(attempts.length,10);
    assert.ok(attempts.every((attempt:any)=>attempt.task2Response?.responseText.startsWith('Essay')));
    await profile('writing result',()=>writing.getWritingAttemptById('perf-attempt-0'),3);
    await db.prepare("INSERT INTO writing_responses (id,attempt_id,task_id,task_version_id,task_number,response_text,version,parent_response_id) VALUES ('perf-revision','perf-attempt-0','perf-task-0','perf-version-0',2,'Revised essay',2,'perf-response-0')").run();
    await db.prepare("INSERT INTO writing_assessments (id,response_id,attempt_id,task_number,status,task_type,created_at) VALUES ('perf-old-grade','perf-revision','perf-attempt-0',2,'failed','task_2','2026-01-01T00:00:00.000Z')").run();
    await db.prepare("INSERT INTO writing_assessments (id,response_id,attempt_id,task_number,status,task_type,task_band,created_at) VALUES ('perf-new-grade','perf-revision','perf-attempt-0',2,'completed','task_2',7,'2026-01-02T00:00:00.000Z')").run();
    const revised=await writing.getWritingAttemptById('perf-attempt-0');
    assert.equal(revised!.task2Response!.responseText,'Revised essay');
    assert.equal(revised!.task2Response!.aiAssessment!.id,'perf-new-grade');
    const refreshed=(await writing.listUserWritingAttempts(student.id)).find(attempt=>attempt.id==='perf-attempt-0');
    assert.equal(refreshed!.task2Response!.version,2);
    const assessments=await profile('speaking history (10 assessments)',()=>speaking.listStudentSpeakingAssessments(student.id),2);
    assert.equal(assessments.length,10);
    assert.ok(assessments.every((assessment:any)=>assessment.teacherPrivateNotes===undefined));
    await profile('speaking teacher queue (10 assessments)',()=>speaking.listTeacherAssessmentQueue(teacher.id),2);
    await db.prepare("INSERT INTO speaking_score_corrections (id,assessment_id,teacher_id,previous_scores_json,updated_scores_json,reason) VALUES ('perf-correction','perf-speaking-0',?,'{}','{}','Corrected score')").run(teacher.id);
    const corrected=(await speaking.listStudentSpeakingAssessments(student.id)).find(assessment=>assessment.id==='perf-speaking-0');
    assert.equal(corrected!.corrections!.length,1);
    assert.equal(corrected!.teacherPrivateNotes,undefined);
    const {listTests,getVersionById}=await import('../server/readingService');
    const {startOrResumeAttempt,saveStudentAnswer,submitAttempt}=await import('../server/attemptService');
    const reading=(await listTests({isTeacherOrAdmin:false}))[0];
    const started=await startOrResumeAttempt({userId:student.id,testId:reading.id});
    const version=(await getVersionById(started.attempt.versionId))!;
    for(const group of version.questionGroups)for(const question of group.questions)await saveStudentAnswer({attemptId:started.attempt.id,userId:student.id,questionId:question.id,questionNumber:question.questionNumber,userAnswer:question.answerKey!,isFlagged:question.questionNumber===1});
    const originalSave=await db.prepare('SELECT id, saved_at FROM reading_answers WHERE attempt_id = ? AND question_number = 1').get(started.attempt.id);
    const result=await profile('reading submission (40 answers)',()=>submitAttempt({attemptId:started.attempt.id,userId:student.id}),8);
    assert.equal(result.rawScore,40);
    const saved=await db.prepare('SELECT id, saved_at, is_flagged FROM reading_answers WHERE attempt_id = ? AND question_number = 1').get(started.attempt.id);
    assert.equal(saved.is_flagged,1);
    assert.equal(saved.id,originalSave.id);
    assert.equal(saved.saved_at,originalSave.saved_at);
    const {listListeningTests,getListeningVersionById}=await import('../server/listeningService');
    const {startOrResumeListeningAttempt,submitListeningAttempt}=await import('../server/listeningAttemptService');
    const listening=(await listListeningTests({isTeacherOrAdmin:false}))[0];
    const listeningStarted=await startOrResumeListeningAttempt({userId:student.id,testId:listening.id});
    await getListeningVersionById(listeningStarted.attempt.versionId);
    const listeningResult=await profile('listening submission (40 unanswered)',()=>submitListeningAttempt({attemptId:listeningStarted.attempt.id,userId:student.id}),8);
    assert.equal(listeningResult.rawScore,0);
    assert.equal((await db.prepare('SELECT COUNT(*) AS count FROM listening_answers WHERE attempt_id = ?').get(listeningStarted.attempt.id)).count,40);
    const {createClass}=await import('../server/classService');
    const {getClassOverview,listClassAssignments}=await import('../server/assignmentService');
    const classItem=await createClass(teacher.id,{title:'Performance Class',testType:'academic'});
    const students=[student.id];
    for(let i=1;i<20;i++) {
      const id=`perf-class-student-${i}`;
      await db.prepare("INSERT INTO users (id,email,password_hash,full_name,role) VALUES (?,?,'test-only',?,'student')").run(id,`${id}@test.invalid`,`Student ${i}`);
      students.push(id);
    }
    for(const id of students)await db.prepare('INSERT INTO class_enrolments (id,class_id,student_id) VALUES (?,?,?)').run(`enrolment-${id}`,classItem.id,id);
    for(let i=0;i<5;i++) {
      const id=`perf-class-assignment-${i}`;
      await db.prepare("INSERT INTO assignments (id,class_id,title,purpose,skill,test_id,version_id,release_at,created_by_id) VALUES (?,?,?,'practice','reading',?,?,?,?)").run(id,classItem.id,`Assignment ${i}`,reading.id,version.id,'2026-01-01T00:00:00.000Z',teacher.id);
      for(const studentId of students)await db.prepare("INSERT INTO reading_attempts (id,user_id,test_id,version_id,test_title,test_type,mode,status,assignment_id,total_questions) VALUES (?,?,?,?,?,'academic','practice','submitted',?,40)").run(`${id}-${studentId}`,studentId,reading.id,version.id,reading.title,id);
    }
    const overview=await profile('class overview (20 students, 5 assignments)',()=>getClassOverview(classItem.id,teacher.id),12);
    assert.equal(overview.totalStudents,20);
    assert.ok(overview.assignments.every((assignment:any)=>assignment.stats.submitted===20));
    assert.ok(overview.studentsProgress.every((row:any)=>row.completedAssignmentsCount===5));
    const assigned=await profile('student assignment list (5 assignments)',()=>listClassAssignments(classItem.id,student.id,'student'),4);
    assert.ok(assigned.every((assignment:any)=>assignment.studentStatus==='submitted'));
  } finally {await pg.close();}
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
