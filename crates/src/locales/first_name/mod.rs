pub trait FirstName {
    const EN: &'static [&'static str] = &["Aaliyah", "Aaron", "Abagail"];
    const FA: &'static [&'static str] = &["علی", "محمد", "قلی"];
}

pub struct FakeFirstName;

impl FirstName for FakeFirstName {}
