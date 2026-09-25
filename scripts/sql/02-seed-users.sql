-- 02 · SEED USERS — generated from lib/users.mjs (82 users)
--
-- When:  after 01-setup.sql on a fresh project, or any time you add users / reset passwords.
-- Safe:  yes, re-runnable. Adds missing users and resets listed users' passwords to the
--        ones below. Never deletes anyone, so existing bids stay linked to their users.
--
-- Passwords are bcrypt-hashed inside Postgres (pgcrypto), the same format the login
-- code checks. To add someone: add a line to the list and re-run.

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

INSERT INTO users (username, password_hash)
SELECT username, extensions.crypt(password, extensions.gen_salt('bf', 10))
FROM (VALUES
  ('gauravchindhe', 'gaurav'),
  ('darshanparekh', 'darshanparekh4821'),
  ('atharvadarade', 'atharvadarade9034'),
  ('shaunakapte', 'shaunakapte6729'),
  ('aryandoshi', 'aryandoshi1187'),
  ('sahildoshi', 'sahildoshi4592'),
  ('akashshirodkar', 'akashshirodkar7340'),
  ('rajsuryawanshi', 'rajsuryawanshi5216'),
  ('sunnymansingh', 'sunnymansingh8352'),
  ('nikhilshinde', 'nikhilshinde9023'),
  ('rishibagade', 'rishibagade6148'),
  ('adityatrivedi', 'adityatrivedi7319'),
  ('shubhamkale', 'shubhamkale1290'),
  ('rohitjadhav', 'rohitjadhav8671'),
  ('amantamane', 'amantamane5403'),
  ('kunalchavan', 'kunalchavan3047'),
  ('tusharchoudhary', 'tusharchoudhary6958'),
  ('rudra', 'rudra2176'),
  ('sandeepshende', 'sandeepshende8432'),
  ('akshayshelar', 'akshayshelar9351'),
  ('dishanttathe', 'dishanttathe1276'),
  ('shantanu', 'shantanu4650'),
  ('shriraj', 'shriraj3701'),
  ('madhusudhan', 'madhusudhan5963'),
  ('ajinkyamense', 'ajinkyamense4317'),
  ('vickyshinde', 'vickyshinde2834'),
  ('sanjayshah', 'sanjayshah6012'),
  ('gurdeep', 'gurdeep1947'),
  ('ashuunhale', 'ashuunhale3386'),
  ('jainebhwani', 'jainebhwani7762'),
  ('princevaswani', 'princevaswani5421'),
  ('neerajsohanda', 'neerajsohanda3259'),
  ('mayurbajaj', 'mayurbajaj9684'),
  ('sonukoshy', 'sonukoshy2105'),
  ('rakshitgilotra', 'rakshitgilotra8042'),
  ('shubhampatil', 'shubhampatil1627'),
  ('sunnybagade', 'sunnybagade9215'),
  ('sunnymaan', 'sunnymaan4830'),
  ('amandeepmaan', 'amandeepmaan7169'),
  ('akshaymurkute', 'akshaymurkute1843'),
  ('ajitmurkute', 'ajitmurkute6709'),
  ('anmolsav', 'anmolsav8301'),
  ('abhijeetkale', 'abhijeetkale1528'),
  ('pravinshetty', 'pravinshetty4072'),
  ('geetikapaul', 'geetikapaul2938'),
  ('lalit', 'lalit9247'),
  ('darshansanghvi', 'darshansanghvi3165'),
  ('shabadkhan', 'shabadkhan5729'),
  ('gandharoswal', 'gandharoswal4612'),
  ('moin', 'moin8642'),
  ('manavmutha', 'manavmutha9510'),
  ('tejastapadia', 'tejastapadia3081'),
  ('digambaryeole', 'digambaryeole7465'),
  ('mohitwadhwani', 'mohitwadhwani2746'),
  ('sheetalaswani', 'sheetalaswani8372'),
  ('zakipathan', 'zakipathan4536'),
  ('rohanpardeshi', 'rohanpardeshi6204'),
  ('pranavnikam', 'pranavnikam7593'),
  ('mohitdevnani', 'mohitdevnani5019'),
  ('kadir', 'kadir2378'),
  ('atharvamamidwar', 'atharvamamidwar8751'),
  ('pratikjaju', 'pratikjaju6823'),
  ('lucky', 'lucky4962'),
  ('pradnesh', 'pradnesh3195'),
  ('matthew', 'matthew7284'),
  ('abhijeetkachole', 'abhijeetkachole4029'),
  ('neerajshinde', 'neerajshinde5830'),
  ('vikaschoudhary', 'vikaschoudhary2674'),
  ('vickydhamale', 'vickydhamale9406'),
  ('saurabhkumar', 'saurabhkumar8142'),
  ('ronithroy', 'ronithroy3651'),
  ('swaroop', 'swaroop1796'),
  ('sahil', 'sahil6428'),
  ('prathameshjoshi', 'prathamesh6969'),
  ('abdulkhan', 'abdulkhan8888'),
  ('abhilasha', 'abhilasha9022'),
  ('pradyanesh', 'pradyanesh7507'),
  ('apurva', 'apurva8600'),
  ('riteshoswal', 'riteshoswal1122'),
  ('aniketjadhav', 'aniketjadhav3344'),
  ('shreyansmunot', 'shreyansmunot5454'),
  ('sunny and amandeep', 'sunny1234')
) AS new_users(username, password)
ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Check
SELECT count(*) AS total_users FROM users;
