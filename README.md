yildiz
==============

This is yildiz.



wget -qO- "http://172.16.36.101:9000/mo?scode=9830568&tel=989105382721&text=10"
wget -qO- "http://172.16.36.101:9000/mo?scode=9830568&tel=989105382721&text=30"
wget  -qO- "http://172.16.36.101:8089/hamrah-vas?number=09105382721&to=30568&content=30"


cd /Users/Mohsun/Project/yildiz;scp -r dao handler mapfa public/javascript public/stylesheets routes util views app.js root@176.221.69.67:/root/yildiz;cd
cd /Users/Mohsun/Project/yildiz;scp -r dao handler mapfa public/javascript public/stylesheets routes util views app.js root@172.16.36.101:/root/yildiz;cd

scp /Users/Mohsun/Project/panel-tajmi/dist/maatel-panel-tajmi.jar root@172.16.36.101:/root

="INSERT INTO service_prop (service_id,`key`,`value`) VALUES (9,'answer-"&B2&"', '"&C2&"');"
="INSERT INTO service_prop (service_id,`key`,`value`) VALUES (9,'question-"&B2&"', '"&A2&"');"
="insert into service_prop (service_id, `key`, `value`) values (12,'content-"&A1&"','"&B1&"');"


wget --post-file=request.xml --header="Content-Type: text/xml" "http://46.209.12.91:8091/hamrah-vas-panel-tajmiei?wsdl" -O response.xml



alias chat_external='ssh root@176.221.69.67 -p 2222'
alias chat_external_publish='cd /Users/Mohsun/Project/chat;scp -r -P 2222 dao handler js public/stylesheets routes util views app.js root@176.221.69.67:/root/chat;cd'
alias chat_internal='ssh root@172.16.36.100'
alias chat_internal_publish='cd /Users/Mohsun/Project/chat;scp -r dao handler js routes util views public/stylesheets app.js root@172.16.36.100:/root/chat;cd'
alias cnpm='npm --registry=https://r.cnpmjs.org \ --cache=/Users/Mohsun/.npm/.cache/cnpm \ --disturl=https://cnpmjs.org/mirrors/node \ --userconfig=/Users/Mohsun/.cnpmrc'
alias innfinision='ssh mohsen@91.98.140.239 -p 2214'
alias l='ls -CFG'
alias ll='ls -alh'
alias lll='ls -lG'
alias maat_external='ssh root@176.221.69.67'
alias maat_external_build='cd /Users/Mohsun/Project/yagis; JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home "/Applications/NetBeans/NetBeans 8.0.app/Contents/Resources/NetBeans 8.0/java/maven/bin/mvn" -DskipTests=true clean install;scp /Users/Mohsun/Project/yagis/target/yagis-1.0-SNAPSHOT.war root@176.221.69.67:/tmp;maat_external'
alias maat_external_publish='cd /Users/Mohsun/Project/yildiz;scp -r dao handler mapfa public routes util views app.js root@176.221.69.67:/root/yildiz;cd'
alias maat_internal='ssh root@172.16.36.101'
alias maat_internal_build='cd /Users/Mohsun/Project/yagis; JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home "/Applications/NetBeans/NetBeans 8.0.app/Contents/Resources/NetBeans 8.0/java/maven/bin/mvn" -DskipTests=true clean install;scp /Users/Mohsun/Project/yagis/target/yagis-1.0-SNAPSHOT.war root@172.16.36.101:/tmp;maat_internal'
alias maat_internal_publish='cd /Users/Mohsun/Project/yildiz;scp -r dao handler mapfa public routes util views app.js root@172.16.36.101:/root/yildiz;cd'
alias mobinone='ssh root@46.209.56.194 -p 36008'
alias mtr='sudo /usr/local/Cellar/mtr/0.85/sbin/mtr'
alias rm='rm -r'
alias rvm-restart='rvm_reload_flag=1 source '\''/Users/Mohsun/.rvm/scripts/rvm'\'''
alias start_mysql='sudo $MYSQL_HOME/bin/mysqld_safe'
alias stop_mysql='sudo $MYSQL_HOME/bin/mysqladmin shutdown'
alias tailf='tail -f'
alias updatedb='sudo /usr/libexec/locate.updatedb'
alias vps='ssh  -D1234 root@149.202.138.169'
alias watch='sh /usr/lib/watch.sh'
alias yagis='cd /Users/Mohsun/Project/yagis; JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home "/Applications/NetBeans/NetBeans 8.0.app/Contents/Resources/NetBeans 8.0/java/maven/bin/mvn" -DskipTests=true clean install;scp /Users/Mohsun/Project/yagis/target/yagis-1.0-SNAPSHOT.war root@10.0.113.22:/tmp;22'





DROP TRIGGER IF EXISTS `sub_history`;
DELIMITER $$
CREATE TRIGGER sub_history
AFTER INSERT ON `subscriber` FOR EACH ROW
BEGIN
       
    INSERT INTO history (tel, service_id) VALUES (NEW.tel, NEW.service_id);
        
END;
$$
DELIMITER ;




DROP TRIGGER IF EXISTS `unsub_history`;
DELIMITER $$
CREATE TRIGGER unsub_history
AFTER UPDATE ON `subscriber` FOR EACH ROW
BEGIN
    IF NEW.un_reg IS NULL THEN
            INSERT INTO history (tel, service_id) VALUES (NEW.tel, NEW.service_id);
    END IF;

    IF NEW.un_reg IS NOT NULL THEN
        UPDATE history SET un_reg = now() WHERE un_reg IS NULL AND tel = OLD.tel AND service_id = OLD.service_id;
    END IF;
        
END;
$$
DELIMITER ;