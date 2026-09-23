import os
os.makedirs("fixtures/forms", exist_ok=True)

# Each fixture: (name, html, expected_fields_that_should_be_filled)
# Values we fill with (matches test profile below)
FORMS = {}

# 1. TRIVIAL — standard names/types. Old engine handles this.
FORMS["01_trivial"] = ("""
<form><input type=email name=email placeholder=Email>
<input type=password name=password>
<input type=text name=first_name placeholder="First Name">
<input type=text name=last_name placeholder="Last Name">
<button type=submit>Sign Up</button></form>
""", {"email","password","first_name","last_name"})

# 2. LABEL-ONLY — opaque ids, real signals live in <label for>. VERY common. Old engine misses.
FORMS["02_label_only"] = ("""
<form>
<label for=f7>Email Address</label><input id=f7 type=text>
<label for=f8>Password</label><input id=f8 type=password>
<label for=f9>First Name</label><input id=f9 type=text>
<label for=f10>Last Name</label><input id=f10 type=text>
<label for=f11>Mobile Phone</label><input id=f11 type=text>
<button type=submit>Join</button></form>
""", {"email","password","first_name","last_name","phone"})

# 3. WRAPPING LABEL + opaque names (name="q_0001" style survey/loyalty platform)
FORMS["03_wrapping_label"] = ("""
<form>
<label>Your email<input name=q_0001 type=text></label>
<label>Choose a password<input name=q_0002 type=password></label>
<label>First name<input name=q_0003 type=text></label>
<label>Last name<input name=q_0004 type=text></label>
<label>ZIP / Postal code<input name=q_0005 type=text></label>
<button>Create Account</button></form>
""", {"email","password","first_name","last_name","zip"})

# 4. CONSENT CHECKBOX required — form rejects submit without it. Old engine never ticks it.
FORMS["04_consent_checkbox"] = ("""
<form>
<input type=email name=email placeholder=Email>
<input type=password name=password placeholder=Password>
<input type=text name=fname placeholder="First name">
<label><input type=checkbox id=terms name=agree> I agree to the Terms & Conditions</label>
<label><input type=checkbox name=age> I am 18 or older</label>
<label><input type=checkbox name=news> Send me marketing emails</label>
<button type=submit>Enroll</button></form>
""", {"email","password","first_name","__consent__"})

# 5. SPLIT DATE OF BIRTH selects (month/day/year) + state select
FORMS["05_split_dob"] = ("""
<form>
<input type=email name=email placeholder=Email>
<label>Birth Month <select name=bmonth><option value="">Month</option><option>January</option><option>November</option></select></label>
<label>Birth Day <select name=bday><option value="">Day</option><option>12</option></select></label>
<label>Birth Year <select name=byear><option value="">Year</option><option>1986</option></select></label>
<label>State <select name=state><option value="">State</option><option value=MO>Missouri</option></select></label>
<button>Sign Me Up</button></form>
""", {"email","__dob__","state"})

# 6. PLACEHOLDER-ONLY, non-standard wording ("Email us at" / "Pick a secret")
FORMS["06_odd_wording"] = ("""
<form>
<input type=text placeholder="you@example.com" name=usr_login>
<input type=password placeholder="Create a secret" name=pw1>
<input type=text placeholder="Given name" name=gn>
<input type=text placeholder="Family name" name=sn>
<button>Get Started</button></form>
""", {"email","password","first_name","last_name"})

# 7. Email-only newsletter-style loyalty join (single field). Old detect requires >=2 -> ignored.
FORMS["07_email_only"] = ("""
<form>
<label for=e>Enter your email to join Rewards</label>
<input id=e type=email name=member_email>
<button>Join Now</button></form>
""", {"email"})

# 8. Decoy hidden header field + real form below (tests .first bug)
FORMS["08_decoy_hidden"] = ("""
<div style="display:none"><input type=email name=email id=hdr_email></div>
<form>
<input type=email name=signup_email placeholder="Email address">
<input type=password name=signup_password placeholder="Password">
<input type=text name=given placeholder="First name">
<button type=submit>Register</button></form>
""", {"email","password","first_name"})

# 9. Shadow DOM web component form (already partially handled by old shadow pass)
FORMS["09_shadow"] = ("""
<div id=host></div>
<script>
const h=document.getElementById('host').attachShadow({mode:'open'});
h.innerHTML='<input type=email name=email placeholder=Email>'+
'<input type=password name=password placeholder=Password>'+
'<input type=text name=first placeholder="First name">'+
'<button>Create</button>';
</script>
""", {"email","password","first_name"})

# 10. Non-signup junk page (auto club marketing, no form) — should be SKIPPED not failed
FORMS["10_junk_no_form"] = ("""
<h1>Premier Auto Club</h1>
<p>Roadside assistance for members. Call 1-800-555-0000 to enroll by phone.</p>
<a href="/about">About us</a>
""", set())

import json
manifest={}
for name,(html,expected) in FORMS.items():
    p=f"fixtures/forms/{name}.html"
    open(p,"w").write("<!doctype html><meta charset=utf-8><body>"+html+"</body>")
    manifest[name]={"path":os.path.abspath(p),"expected":sorted(expected)}
open("fixtures/manifest.json","w").write(json.dumps(manifest,indent=2))
print("built",len(FORMS),"fixtures")
for k,v in manifest.items(): print(" ",k,"->",v["expected"])
