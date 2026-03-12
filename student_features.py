issues = []

def submit_issue(title, description, issue_type):
    issue = {
        "title": title, 
        "description": description,
        "issue_type": issue_type,
        "status": "Open"
    }
     
    issues.append(issue)
    print("Issue submitted successfully!")

def view_issues():
    if not issues:
        print("No, issues submitted yet.")
    
    for i, issue in enumerate(issues, start=1):
        print(f"{i}. {issue['title']} - {issue['status']} ({issue['issue_type']})")        
        
submit_issue("Login bug", "Cannot login to portal", "Missing Marks")
submit_issue("Grade Appeal", "Appeal for CSC1202 grade", "Appeal")  
view_issues()      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    
