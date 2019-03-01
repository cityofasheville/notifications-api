select * from internal.permits 
left join internal.permit_tasks 
on permits.permit_num = permit_tasks.permit_num 
left join internal.permit_custom_fields
on permits.permit_num = permit_custom_fields.permit_num 
left join internal.permit_contractors
on permits.permit_num = permit_contractors.permit_num 
left join internal.permit_comments
on permits.permit_num = permit_comments.permit_num 
where permits.permit_num = '05-06385'
order by permits.permit_num desc limit 100;