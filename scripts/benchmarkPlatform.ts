import '../server/environment';
import { performance } from 'node:perf_hooks';
import { db } from '../server/db';
import { listWritingTasks, listUserWritingAttempts, getWritingAttemptById } from '../server/writingService';
import { listSpeakingSets, listStudentSpeakingAssessments, listTeacherAssessmentQueue } from '../server/speakingService';
import { listUserAttempts, getAttemptById } from '../server/attemptService';
import { listUserListeningAttempts, getListeningAttemptById } from '../server/listeningAttemptService';
import { listStudentClasses, listTeacherClasses } from '../server/classService';
import { getClassOverview } from '../server/assignmentService';
import { getUserCommercialSummary } from '../server/commercialService';

async function main() {
  let queries = 0;
  const prepare = db.prepare.bind(db);
  db.prepare = sql => {queries++;return prepare(sql);};
  async function measure(flow:string, work:()=>Promise<any>) {
    queries=0;
    const start=performance.now();
    const result=await work();
    console.log(JSON.stringify({flow,queries,durationMs:Math.round(performance.now()-start),...(Array.isArray(result)?{records:result.length}:{})}));
    return result;
  }
  try {
    const student = await db.prepare("SELECT id FROM users WHERE role = 'student' ORDER BY created_at DESC LIMIT 1").get();
    const teacher = await db.prepare("SELECT id FROM users WHERE role IN ('teacher','admin') ORDER BY created_at LIMIT 1").get();
    await measure('writing catalogue',()=>listWritingTasks({userRole:'student'}));
    await measure('speaking catalogue',()=>listSpeakingSets('student'));
    if (student) {
      const reading = await measure('reading history',()=>listUserAttempts(student.id));
      const listening = await measure('listening history',()=>listUserListeningAttempts(student.id));
      const writing = await measure('writing history',()=>listUserWritingAttempts(student.id));
      await measure('speaking history',()=>listStudentSpeakingAssessments(student.id));
      await measure('student classes',()=>listStudentClasses(student.id));
      await measure('account and allowances',()=>getUserCommercialSummary(student.id));
      await measure('account and allowances (warm)',()=>getUserCommercialSummary(student.id));
      if(reading.length)await measure('reading result',()=>getAttemptById(reading[0].id,student.id));
      if(listening.length)await measure('listening result',()=>getListeningAttemptById(listening[0].id,student.id));
      if(writing.length)await measure('writing result',()=>getWritingAttemptById(writing[0].id));
    }
    if(teacher) {
      await measure('speaking teacher queue',()=>listTeacherAssessmentQueue(teacher.id));
      const classes = await measure('teacher classes',()=>listTeacherClasses(teacher.id));
      if(classes.length)await measure('class overview',()=>getClassOverview(classes[0].id,teacher.id));
    }
  } finally {await db.close();}
}
main().catch(error=>{console.error(error.code||error.message);process.exitCode=1;});
