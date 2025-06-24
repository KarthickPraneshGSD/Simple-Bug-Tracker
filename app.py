from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:3001"])

# Database setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bugs.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Model
class Bug(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    status = db.Column(db.String(50), default='open')

# Create DB
with app.app_context():
    db.create_all()

# Homepage route
@app.route('/')
def home():
    return '🐍 Flask API is working!'

# Get all bugs
@app.route('/api/bugs', methods=['GET'])
def get_bugs():
    bugs = Bug.query.all()
    return jsonify([
        {
            'id': bug.id,
            'title': bug.title,
            'description': bug.description,
            'status': bug.status
        } for bug in bugs
    ])

# Add a new bug
@app.route('/api/bugs', methods=['POST'])
def add_bug():
    data = request.get_json()
    new_bug = Bug(
        title=data['title'],
        description=data.get('description', ''),
        status=data.get('status', 'open')
    )
    db.session.add(new_bug)
    db.session.commit()
    return jsonify({'message': 'Bug added'}), 201

# Update bug status
@app.route('/api/bugs/<int:bug_id>', methods=['PUT'])
def update_bug_status(bug_id):
    bug = Bug.query.get_or_404(bug_id)
    data = request.get_json()
    bug.status = data.get('status', bug.status)
    db.session.commit()
    return jsonify({'message': 'Bug status updated'})

# Delete a bug
@app.route('/api/bugs/<int:bug_id>', methods=['DELETE'])
def delete_bug(bug_id):
    bug = Bug.query.get_or_404(bug_id)
    db.session.delete(bug)
    db.session.commit()
    return jsonify({'message': 'Bug deleted'})

if __name__ == '__main__':
    app.run(debug=True)
