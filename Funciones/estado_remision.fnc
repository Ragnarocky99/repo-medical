create or replace function estado_remision(p_id_remision in number) return varchar2 is
  vestado varchar2(10);
  v_cantidad_en_remision number(9);
  v_cantidad_en_pendientes number(9);
begin
     
   select c.estado
   into   vestado
   from stw_entsal_cab c
   where c.id = p_id_remision;
   if vestado = 'A' then
     vestado := 'Anulado';
     return vestado;
   end if;
     
   
    select count(*)
      into v_cantidad_en_remision
      from stw_entsal_det d
      where d.id_entsal_cab = p_id_remision;
      
    select count(*)
      into v_cantidad_en_pendientes
    from vtwv_facturar_remisiones rp
    where rp.ID_REMISION = p_id_remision;
    
    select 
     case v_cantidad_en_pendientes
       when v_cantidad_en_remision then 'Pendiente'
       when 0 then 'Facturado'
       else 'Parcial'
     end
     into vestado
     from dual;
  

  return(vestado);
end estado_remision;
/
