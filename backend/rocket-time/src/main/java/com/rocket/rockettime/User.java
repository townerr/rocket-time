import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class User {
    private @Id GeneratedValue Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String passwordHash;
    private int role;

    User() {}

    User(String first, String last, String email, int role) {
        this.firstName = first;
        this.lastName = last;
        this.email = email;
        this.role = role;
    }

    User(String email, String hash) {
        this.email = email;
        this.passwordHash = hash;
    }

    public Long getId() {
        return this.Id;
    }

    public String getFistName() {
        return this.firstName;
    }

    public String getLastName() {
        return this.LastName;
    }

    public String getEmail() {
        return this.firstName;
    }

    public String getRole() {
        return this.firstName;
    }

    public String getPasswordHash() {
        return this.passwordHash;
    }

    public void setId(Long id) {
        this.Id = id;
    }
    
    public void setFirstName(String first) {
        this.firstName = first;
    }

    public void setLastName(String last) {
        this.lastName = last;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPasswordHash(String hash) {
        this.passwordHash = hash;
    }

    public void setRole(int role) {
        this.role = role;
    }
}
