import { BUSINESS as B, MARKETING, SCORING as S } from './data.js';
export const rupiah = value => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(value);
const clamp = n => Math.max(0,Math.min(100,n));
export function calculateBudget(plan,cash=B.capital){
 const revenue=plan.target*B.price, material=plan.stock*B.material, expenses=material+B.fixed+plan.marketing;
 return {...plan,revenue,material,fixed:B.fixed,expenses,profit:revenue-expenses,endingCash:cash+revenue-expenses,valid:Number.isInteger(plan.target)&&plan.target>=250&&plan.target<=800&&Number.isInteger(plan.stock)&&plan.stock>=250&&plan.stock<=800&&MARKETING.includes(plan.marketing)&&expenses<=cash};
}
export function calculateActualResult(budget,event,accepted,cash,fluctuation){
 const active=!event.decision||accepted;
 const demand=Math.round(B.demand*fluctuation*(1+budget.marketing/5000000)*(active?(event.demand||1):1));
 const sold=Math.min(demand,budget.stock), material=Math.round(budget.stock*B.material*(event.material||1));
 const marketing=budget.marketing+(event.decision&&accepted?event.cost:0), fixed=B.fixed+(event.expense||0);
 const revenue=sold*B.price, expenses=material+marketing+fixed, profit=revenue-expenses;
 return {demand,sold,material,marketing,fixed,revenue,expenses,profit,endingCash:cash+profit,stock:budget.stock,waste:budget.stock-sold,missed:Math.max(0,demand-sold),fluctuation};
}
export function calculateVariance(budget,actual){return ['revenue','material','marketing','fixed','profit'].map(key=>({key,budget:budget[key],actual:actual[key],delta:actual[key]-budget[key],favorable:['revenue','profit'].includes(key)?actual[key]>=budget[key]:actual[key]<=budget[key]}));}
export function calculateWeeklyScore(budget,actual){return {accuracy:clamp(100*(1-Math.abs(actual.profit-budget.profit)/Math.max(Math.abs(budget.profit),B.fixed))),efficiency:100*actual.sold/budget.stock};}
export function calculateFinalScore(history){
 const revenue=history.reduce((s,h)=>s+h.actual.revenue,0), expenses=history.reduce((s,h)=>s+h.actual.expenses,0), profit=revenue-expenses;
 const accuracy=history.reduce((s,h)=>s+calculateWeeklyScore(h.budget,h.actual).accuracy,0)/Math.max(1,history.length);
 const efficiency=100*history.reduce((s,h)=>s+h.actual.sold,0)/Math.max(1,history.reduce((s,h)=>s+h.budget.stock,0));
 const cash=history.filter(h=>h.actual.endingCash>0).length/Math.max(1,history.length)*100;
 const profitability=clamp(profit/S.profitGoal*100),score=Math.round(profitability*S.profitability+accuracy*S.accuracy+cash*S.cash+efficiency*S.efficiency);
 return {revenue,expenses,profit,endingCash:B.capital+profit,accuracy,efficiency,cash,profitability,score,label:score>=85?'Ahli Anggaran':score>=70?'Perencana Cerdas':score>=50?'Pengusaha Berkembang':'Terus Asah Perencanaan'};
}
