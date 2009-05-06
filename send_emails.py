import os
import smtplib
import sys
try:
    import simplejson as json
except ImportError:
    import json
from couchdb import ResourceConflict, Server

server = Server('http://127.0.0.1:5984')

# TODO this config info should be loaded from the design doc, and re-loaded
# on-the-fly
RECIPIENTS = {
    'elyservice': {
        'subject': 'Message sent through ElyService.com',
        'emails': [
            'xxxxx@jasondavies.com',
        ],
    },
}

def listen():
    while True: 
        try: 
            line = sys.stdin.readline() 
             
            # poor man's validation. If we get garbage, we sys.exit 
            if not line.endswith('}\n'): 
                sys.exit(0) 
            note = json.loads(line) 

            # we don't care for deletes 
            if note.get('type') == 'delete': 
                continue 

            db_name = note.get('db')
            # we don't care for other databases
            if db_name not in RECIPIENTS:
                continue

            db = server[db_name]
            smtp_server = smtplib.SMTP('localhost')
            for row in db.view('couchdb-contact-form/mail_spool', include_docs=True):
                doc = row.doc
                # failsafe check
                if doc['status'] != 'spool':
                    continue
                try:
                    # update message status
                    doc['status'] = 'processing'
                    db[doc.id] = doc
                    validate_str = doc['from'] + doc['from_name']
                    if '\n' in validate_str or '\r' in validate_str:
                        doc['status'] = 'invalid'
                        db[doc.id] = doc
                        continue
                    message = "From: %s <%s>\r\nTo: %s\r\nSubject: %s\r\n\r\n%s" % (
                        doc['from_name'], doc['from'], ', '.join(RECIPIENTS[db_name]['emails']),
                        RECIPIENTS[db_name]['subject'], doc['text'])
                    smtp_server.sendmail(doc['from'], RECIPIENTS[db_name]['emails'], message)
                    doc['status'] = 'sent'
                    db[doc.id] = doc
                except ResourceConflict:
                    continue
            smtp_server.quit()

        except IOError: 
            pass

if __name__ == '__main__':
    listen()
