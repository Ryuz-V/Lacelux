import re

with open('public/profile/profile.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update Edit button
text = text.replace(
    '<a href="../#" class="edit-link"><i data-feather="edit"></i> Change Profile Information</a>',
    '<a href="#" class="edit-link" id="edit-profile-btn"><i data-feather="edit"></i> Change Profile Information</a>'
)

# 2. Update Form Fields
text = text.replace(
    '<input type="text" value="Kazi Mahbub" readonly>',
    '<input type="text" id="input-fullName" name="fullName" readonly>',
    1 # Only the first one which is Name
)

text = text.replace(
    '<input type="text" value="Kazi Mahbub" readonly>',
    '<input type="text" id="input-username" name="username" readonly>',
    1 # The second one which is Username
)

text = text.replace(
    '<input type="text" value="+90-123456789" readonly>',
    '<input type="text" id="input-phoneNumber" name="phoneNumber" readonly>'
)

text = text.replace(
    '<input type="email" value="abcd1234@email.com" readonly>',
    '<input type="email" id="input-email" name="email" readonly disabled>' # Make email disabled as it shouldn't be easily changed
)

# Add Save button before </form>
save_btn = """
                    <div class="form-group" style="margin-top: 20px;">
                        <button type="submit" id="save-profile-btn" style="display: none; padding: 10px 20px; background-color: #000; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-family: 'Poppins', sans-serif;">Save Changes</button>
                    </div>
                </form>
"""
text = text.replace('</form>', save_btn)

# Add Script at the end
script = """
    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '../Login/login.html';
                return;
            }

            // Fetch Profile Data
            try {
                const res = await fetch('http://localhost:3000/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (res.ok) {
                    const user = await res.json();
                    document.getElementById('input-fullName').value = user.fullName || '';
                    document.getElementById('input-username').value = user.username || '';
                    document.getElementById('input-email').value = user.email || '';
                    document.getElementById('input-phoneNumber').value = user.phoneNumber || '';
                    
                    if (user.gender) {
                        const genderRadio = document.querySelector(`input[name="gender"][value="${user.gender}"]`);
                        if (genderRadio) genderRadio.checked = true;
                    }
                    
                    // Update header name
                    document.querySelector('.user-name').textContent = user.fullName;
                } else {
                    console.error('Failed to load profile');
                }
            } catch (err) {
                console.error(err);
            }

            // Edit Profile logic
            const editBtn = document.getElementById('edit-profile-btn');
            const saveBtn = document.getElementById('save-profile-btn');
            const inputs = document.querySelectorAll('.profile-form input[type="text"]');
            const radios = document.querySelectorAll('.profile-form input[type="radio"]');
            
            // Initially disable radios
            radios.forEach(r => r.disabled = true);

            editBtn.addEventListener('click', (e) => {
                e.preventDefault();
                inputs.forEach(input => input.removeAttribute('readonly'));
                radios.forEach(r => r.disabled = false);
                saveBtn.style.display = 'block';
                editBtn.style.display = 'none';
            });

            // Save Profile logic
            const form = document.querySelector('.profile-form');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                saveBtn.textContent = 'Saving...';
                
                const formData = new FormData(form);
                const data = {
                    fullName: formData.get('fullName'),
                    username: formData.get('username'),
                    phoneNumber: formData.get('phoneNumber'),
                    gender: formData.get('gender')
                };

                try {
                    const res = await fetch('http://localhost:3000/api/auth/profile', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(data)
                    });

                    if (res.ok) {
                        alert('Profile updated successfully!');
                        const result = await res.json();
                        
                        // Update UI
                        document.querySelector('.user-name').textContent = result.user.fullName;
                        
                        // Re-lock form
                        inputs.forEach(input => input.setAttribute('readonly', true));
                        radios.forEach(r => r.disabled = true);
                        saveBtn.style.display = 'none';
                        saveBtn.textContent = 'Save Changes';
                        editBtn.style.display = 'flex';
                    } else {
                        const err = await res.json();
                        alert('Error: ' + err.message);
                        saveBtn.textContent = 'Save Changes';
                    }
                } catch (err) {
                    console.error(err);
                    alert('An error occurred');
                    saveBtn.textContent = 'Save Changes';
                }
            });
        });
    </script>
"""

# Inject script before feather.replace(); inside existing script block if possible, or just before </body>
if '<script>' in text:
    last_script_idx = text.rfind('<script>')
    text = text[:last_script_idx] + script + text[last_script_idx:]
else:
    body_end = text.find('</body>')
    text = text[:body_end] + script + text[body_end:]

with open('public/profile/profile.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("HTML logic injected")
